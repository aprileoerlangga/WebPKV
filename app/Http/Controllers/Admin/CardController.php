<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\IssueCardRequest;
use App\Http\Requests\ReturnCardRequest;
use App\Models\VisitorCard;
use App\Models\VisitorCardApplication;
use App\Models\CardHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // ✅ Tambahkan ini

class CardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $cards = VisitorCard::with(['application.station', 'issuer'])
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when($request->search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('card_number', 'like', "%{$search}%")
                      ->orWhereHas('application', function ($appQuery) use ($search) {
                          $appQuery->where('full_name', 'like', "%{$search}%")
                                   ->orWhere('application_number', 'like', "%{$search}%");
                      });
                });
            })
            ->orderBy('issued_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $cards
        ]);
    }

    public function approvedApplications(): JsonResponse
    {
        $applications = VisitorCardApplication::with(['station'])
            ->where('status', 'approved')
            ->whereDoesntHave('visitorCard')
            ->orderBy('processed_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $applications
        ]);
    }

    public function issue(IssueCardRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $application = VisitorCardApplication::findOrFail($validated['application_id']);

        if ($application->status !== 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan belum disetujui'
            ], 422);
        }

        if ($application->visitorCard) {
            return response()->json([
                'success' => false,
                'message' => 'Kartu sudah pernah diserahkan untuk pengajuan ini'
            ], 422);
        }

        $card = VisitorCard::create([
            'application_id' => $application->id,
            'status' => 'issued',
            'condition_when_issued' => 'good',
            'issued_at' => now(),
            'issued_by' => Auth::id() // ✅ Ganti dari auth()->id()
        ]);

        // Record history
        CardHistory::create([
            'card_id' => $card->id,
            'action' => 'issued',
            'notes' => 'Kartu visitor diserahkan kepada pemohon',
            'performed_by' => Auth::id() // ✅ Ganti dari auth()->id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kartu berhasil diserahkan',
            'data' => $card->load(['application.station'])
        ]);
    }

    public function returnCard(ReturnCardRequest $request, VisitorCard $card): JsonResponse
    {
        if ($card->status !== 'issued') {
            return response()->json([
                'success' => false,
                'message' => 'Kartu tidak dalam status diserahkan'
            ], 422);
        }

        $validated = $request->validated();

        $card->update([
            'status' => 'returned',
            'condition_when_returned' => $validated['condition'],
            'damage_reason' => $validated['damage_reason'] ?? null,
            'damage_handling' => $validated['damage_handling'] ?? null,
            'returned_at' => now(),
            'received_by' => Auth::id() // ✅ Ganti dari auth()->id()
        ]);

        // Record history
        CardHistory::create([
            'card_id' => $card->id,
            'action' => 'returned',
            'notes' => $validated['notes'] ?? 'Kartu visitor dikembalikan',
            'performed_by' => Auth::id() // ✅ Ganti dari auth()->id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kartu berhasil diterima kembali'
        ]);
    }

    public function markDamaged(Request $request, VisitorCard $card): JsonResponse
    {
        $request->validate([
            'reason' => 'required|string|max:500',
            'handling' => 'required|string|max:500'
        ]);

        $card->update([
            'status' => 'damaged',
            'damage_reason' => $request->reason,
            'damage_handling' => $request->handling
        ]);

        // Record history
        CardHistory::create([
            'card_id' => $card->id,
            'action' => 'marked_damaged',
            'notes' => "Kartu ditandai rusak: {$request->reason}",
            'performed_by' => Auth::id() // ✅ Ganti dari auth()->id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kartu berhasil ditandai rusak'
        ]);
    }

    public function markLost(Request $request, VisitorCard $card): JsonResponse
    {
        $request->validate([
            'reason' => 'required|string|max:500',
            'handling' => 'required|string|max:500'
        ]);

        $card->update([
            'status' => 'lost',
            'damage_reason' => $request->reason,
            'damage_handling' => $request->handling
        ]);

        // Record history
        CardHistory::create([
            'card_id' => $card->id,
            'action' => 'marked_lost',
            'notes' => "Kartu ditandai hilang: {$request->reason}",
            'performed_by' => Auth::id() // ✅ Ganti dari auth()->id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kartu berhasil ditandai hilang'
        ]);
    }

    public function history(VisitorCard $card): JsonResponse
    {
        $histories = $card->histories()
            ->with('performer')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $histories
        ]);
    }
}
