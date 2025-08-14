<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationRequest;
use App\Models\VisitorCardApplication;
use App\Models\Station;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function store(StoreApplicationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Handle file upload if exists
        if ($request->hasFile('supporting_document')) {
            $validated['supporting_document_path'] = $request->file('supporting_document')
                ->store('documents', 'public');
        }

        $application = VisitorCardApplication::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan kartu visitor berhasil dikirim',
            'data' => [
                'application_number' => $application->application_number,
                'status' => $application->status,
                'full_name' => $application->full_name,
                'visit_start_date' => $application->visit_start_date,
                'visit_end_date' => $application->visit_end_date,
            ]
        ], 201);
    }

    public function checkStatus(Request $request): JsonResponse
    {
        $request->validate([
            'application_number' => 'required|string|exists:visitor_card_applications,application_number'
        ]);

        $application = VisitorCardApplication::with(['station', 'processor', 'visitorCard'])
            ->where('application_number', $request->application_number)
            ->first();

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Nomor pengajuan tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'application_number' => $application->application_number,
                'full_name' => $application->full_name,
                'company_institution' => $application->company_institution,
                'station' => $application->station->name,
                'visit_purpose' => $application->visit_purpose,
                'visit_start_date' => $application->visit_start_date->format('d/m/Y'),
                'visit_end_date' => $application->visit_end_date->format('d/m/Y'),
                'status' => $application->status,
                'created_at' => $application->created_at->format('d/m/Y H:i'),
                'processed_at' => $application->processed_at?->format('d/m/Y H:i'),
                'rejection_reason' => $application->rejection_reason,
                'approval_notes' => $application->approval_notes,
                'card_status' => $application->visitorCard?->status,
                'card_number' => $application->visitorCard?->card_number,
            ]
        ]);
    }

    public function cancel(Request $request): JsonResponse
    {
        $request->validate([
            'application_number' => 'required|string|exists:visitor_card_applications,application_number'
        ]);

        $application = VisitorCardApplication::where('application_number', $request->application_number)
            ->where('status', 'pending')
            ->first();

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan tidak dapat dibatalkan atau sudah diproses'
            ], 422);
        }

        $application->update(['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan berhasil dibatalkan'
        ]);
    }

    public function getStations(): JsonResponse
    {
        $stations = Station::where('is_active', true)
            ->select('id', 'name', 'code')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $stations
        ]);
    }
}
