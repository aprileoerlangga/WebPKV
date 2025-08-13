<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VisitorCardApplication;
use App\Models\VisitorCard;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $today = today();

        $stats = [
            'active_visitors' => VisitorCard::where('status', 'issued')
                ->whereHas('application', function ($query) use ($today) {
                    $query->where('visit_start_date', '<=', $today)
                          ->where('visit_end_date', '>=', $today);
                })->count(),

            'pending_applications' => VisitorCardApplication::where('status', 'pending')->count(),

            'cards_issued_today' => VisitorCard::whereDate('issued_at', $today)->count(),

            'cards_returned_today' => VisitorCard::whereDate('returned_at', $today)->count(),

            'damaged_cards' => VisitorCard::where('status', 'damaged')->count(),

            'lost_cards' => VisitorCard::where('status', 'lost')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
