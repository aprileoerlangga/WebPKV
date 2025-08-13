<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VisitorCard;
use App\Exports\CardIssuanceExport;
use App\Exports\CardReturnExport;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function cardIssuanceReport(Request $request): JsonResponse
    {
        $request->validate([
            'period' => 'required|in:daily,weekly,monthly,yearly',
            'date' => 'required|date',
        ]);

        $date = Carbon::parse($request->date);
        $query = VisitorCard::with(['application.station', 'issuer']);

        switch ($request->period) {
            case 'daily':
                $query->whereDate('issued_at', $date);
                break;
            case 'weekly':
                $query->whereBetween('issued_at', [
                    $date->startOfWeek(),
                    $date->endOfWeek()
                ]);
                break;
            case 'monthly':
                $query->whereMonth('issued_at', $date->month)
                      ->whereYear('issued_at', $date->year);
                break;
            case 'yearly':
                $query->whereYear('issued_at', $date->year);
                break;
        }

        $cards = $query->orderBy('issued_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $cards,
            'summary' => [
                'total_issued' => $cards->count(),
                'period' => $request->period,
                'date_range' => $this->getDateRange($request->period, $date),
            ]
        ]);
    }

    public function cardReturnReport(Request $request): JsonResponse
    {
        $request->validate([
            'period' => 'required|in:daily,weekly,monthly,yearly',
            'date' => 'required|date',
        ]);

        $date = Carbon::parse($request->date);
        $query = VisitorCard::with(['application.station', 'receiver'])
                           ->whereNotNull('returned_at');

        switch ($request->period) {
            case 'daily':
                $query->whereDate('returned_at', $date);
                break;
            case 'weekly':
                $query->whereBetween('returned_at', [
                    $date->startOfWeek(),
                    $date->endOfWeek()
                ]);
                break;
            case 'monthly':
                $query->whereMonth('returned_at', $date->month)
                      ->whereYear('returned_at', $date->year);
                break;
            case 'yearly':
                $query->whereYear('returned_at', $date->year);
                break;
        }

        $cards = $query->orderBy('returned_at', 'desc')->get();

        $summary = [
            'total_returned' => $cards->count(),
            'good_condition' => $cards->where('condition_when_returned', 'good')->count(),
            'damaged' => $cards->where('condition_when_returned', 'damaged')->count(),
            'lost' => $cards->where('condition_when_returned', 'lost')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $cards,
            'summary' => array_merge($summary, [
                'period' => $request->period,
                'date_range' => $this->getDateRange($request->period, $date),
            ])
        ]);
    }

    public function exportCardIssuance(Request $request)
    {
        $request->validate([
            'period' => 'required|in:daily,weekly,monthly,yearly',
            'date' => 'required|date',
        ]);

        return Excel::download(
            new CardIssuanceExport($request->period, $request->date),
            "laporan-penyerahan-kartu-{$request->period}-{$request->date}.xlsx"
        );
    }

    public function exportCardReturn(Request $request)
    {
        $request->validate([
            'period' => 'required|in:daily,weekly,monthly,yearly',
            'date' => 'required|date',
        ]);

        return Excel::download(
            new CardReturnExport($request->period, $request->date),
            "laporan-pengembalian-kartu-{$request->period}-{$request->date}.xlsx"
        );
    }

    private function getDateRange(string $period, Carbon $date): array
    {
        switch ($period) {
            case 'daily':
                return [
                    'start' => $date->toDateString(),
                    'end' => $date->toDateString(),
                ];
            case 'weekly':
                return [
                    'start' => $date->startOfWeek()->toDateString(),
                    'end' => $date->endOfWeek()->toDateString(),
                ];
            case 'monthly':
                return [
                    'start' => $date->startOfMonth()->toDateString(),
                    'end' => $date->endOfMonth()->toDateString(),
                ];
            case 'yearly':
                return [
                    'start' => $date->startOfYear()->toDateString(),
                    'end' => $date->endOfYear()->toDateString(),
                ];
            default:
                return ['start' => null, 'end' => null];
        }
    }
}
