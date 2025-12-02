<?php

use App\Http\Controllers\Admin\AdminCropController;
use App\Http\Controllers\Admin\AdminFarmerController;
use App\Http\Controllers\CropController;
use App\Http\Controllers\FarmerController;
use App\Http\Controllers\FarmerProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --------------------------------------------------------
// Public API routes
// --------------------------------------------------------
Route::get('/', function () {
    return Inertia::render('Index', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/farmers', [FarmerController::class, 'index'])->name('farmers.index');
Route::get('/farmers/{farmer}', [FarmerController::class, 'show'])->name('farmers.show');

Route::get('/crops', [CropController::class, 'index'])->name('crops.index');

Route::middleware('auth')->group(function () {
    Route::get('/pending', function() {
        if (Auth::user()->isApproved) {
            return redirect()->route('farmers.index');
        } return Inertia::render('Index');
    })->name('pending');
});

// --------------------------------------------------------
// Auth Routes for Farmers
// --------------------------------------------------------
Route::middleware(['approved.farmer'])->group(function () {
    Route::get('/profile', [FarmerProfileController::class, 'show'])->name('profile.edit');
    Route::patch('/profile', [FarmerProfileController::class, 'update'])->name('profile.update');
});
// --------------------------------------------------------
// Auth Routes for Admin
// --------------------------------------------------------
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    // Crops management endpoints (no separate admin pages)
    Route::get('/crops', [AdminCropController::class, 'create'])->name('crops.create'); // Index
    Route::post('/crops', [AdminCropController::class, 'store'])->name('crops.store'); // Store
    Route::post('/crops/{crop}', [AdminCropController::class, 'update'])->name('crops.update'); // Update
    Route::delete('/crops/{crop}', [AdminCropController::class, 'destroy'])->name('crops.destroy'); // Delete
    // Pending Farmers actions
    Route::post('/farmers/{user}/approve', [AdminFarmerController::class, 'approve'])->name('farmers.approve'); // Approve Pending Farmers
    Route::delete('/farmers/{user}/reject', [AdminFarmerController::class, 'reject'])->name('farmers.reject');    // Reject Pending Farmers

    Route::get('/api/barangays', [AdminFarmerController::class, 'getBarangays'])->name('admin.api.barangays');
});

require __DIR__.'/auth.php';
