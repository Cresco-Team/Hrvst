<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Barangay;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/', [CategoryController::class]);

// --------------------------------------------------------
// Public API Routes for registration
// --------------------------------------------------------
Route::get('/barangays', function (Request $request) {
    $barangays = Barangay::where('municipality_id', $request->municipality_id)
        ->get();
    return response()->json($barangays);
});
