<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProcessApplicationRequest;
use App\Models\VisitorCardApplication;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // ✅ Tambahkan ini

class ApplicationController extends Controller
{
    private NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function index(Request $request): JsonResponse
    {
        $applications = VisitorCardApplication::with(['station'])
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when($request->search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%")
                      ->orWhere('application_number', 'like', "%{$search}%")
                      ->orWhere('company_institution', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $applications
        ]);
    }

    public function show(VisitorCardApplication $application): JsonResponse
    {
        $application->load(['station', 'processor']);

        return response()->json([
            'success' => true,
            'data' => $application
        ]);
    }

    public function approve(ProcessApplicationRequest $request, VisitorCardApplication $application): JsonResponse
    {
        if ($application->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan sudah diproses sebelumnya'
            ], 422);
        }

        $application->update([
            'status' => 'approved',
            'approval_notes' => $request->validated()['notes'] ?? null,
            'processed_at' => now(),
            'processed_by' => Auth::id() // ✅ Ganti dari auth()->id()
        ]);

        // Send notification
        $this->notificationService->sendApprovalNotification($application);

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan berhasil disetujui'
        ]);
    }

    public function reject(ProcessApplicationRequest $request, VisitorCardApplication $application): JsonResponse
    {
        if ($application->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan sudah diproses sebelumnya'
            ], 422);
        }

        $validated = $request->validated();

        $application->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['reason'],
            'processed_at' => now(),
            'processed_by' => Auth::id() // ✅ Ganti dari auth()->id()
        ]);

        // Send notification
        $this->notificationService->sendRejectionNotification($application);

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan berhasil ditolak'
        ]);
    }
}
