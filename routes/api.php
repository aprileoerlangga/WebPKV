<?php

use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ApplicationController as AdminApplicationController;
use App\Http\Controllers\Admin\CardController;
use App\Http\Controllers\Admin\ReportController;
use Illuminate\Support\Facades\Route;

// Public API Routes
Route::prefix('v1')->group(function () {
    Route::get('stations', [ApplicationController::class, 'getStations']);
    Route::post('applications', [ApplicationController::class, 'store']);
    Route::post('applications/check-status', [ApplicationController::class, 'checkStatus']);
    Route::post('applications/cancel', [ApplicationController::class, 'cancel']);
});

// Admin Authentication Routes
Route::prefix('admin')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    // Protected Admin Routes
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);

        // Dashboard
        Route::get('dashboard', [DashboardController::class, 'index']);

        // Applications Management
        Route::prefix('applications')->group(function () {
            Route::get('/', [AdminApplicationController::class, 'index']);
            Route::get('{application}', [AdminApplicationController::class, 'show']);
            Route::post('{application}/approve', [AdminApplicationController::class, 'approve']);
            Route::post('{application}/reject', [AdminApplicationController::class, 'reject']);
        });

        // Cards Management
        Route::prefix('cards')->group(function () {
            Route::get('/', [CardController::class, 'index']);
            Route::get('approved-applications', [CardController::class, 'approvedApplications']);
            Route::post('issue', [CardController::class, 'issue']);
            Route::post('{card}/return', [CardController::class, 'returnCard']);
            Route::post('{card}/mark-damaged', [CardController::class, 'markDamaged']);
            Route::post('{card}/mark-lost', [CardController::class, 'markLost']);
            Route::get('{card}/history', [CardController::class, 'history']);
        });

        // Reports
        Route::prefix('reports')->group(function () {
            Route::get('card-issuance', [ReportController::class, 'cardIssuanceReport']);
            Route::get('card-return', [ReportController::class, 'cardReturnReport']);
            Route::get('export/card-issuance', [ReportController::class, 'exportCardIssuance']);
            Route::get('export/card-return', [ReportController::class, 'exportCardReturn']);
        });
    });
});

// Add route for admin UI
Route::get('/admin', function () {
    return view('admin');
});
