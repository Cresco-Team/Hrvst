<?php

use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Barangay;
use App\Http\Controllers\FarmerController;
use App\Http\Controllers\MunicipalityController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/', [CategoryController::class]);

// --------------------------------------------------------
// Public API Routes for registration
// --------------------------------------------------------
Route::get('/municipalities/{municipality}', [MunicipalityController::class, 'show']);

Route::get('/barangays', function (Request $request) {
    $barangays = Barangay::where('municipality_id', $request->municipality_id)
        ->get();
    return response()->json($barangays);
});

// API endpoint for fetching farmer details (for modal)
Route::get('/api/farmers/{farmer}', [FarmerController::class, 'show'])->name('api.farmers.show');

// Public API routes for cascading dropdowns
Route::get('/barangays', [FarmerController::class, 'getBarangays'])->name('public.api.barangays');