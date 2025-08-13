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
