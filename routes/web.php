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
    return Inertia::render('index', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/farmers', [FarmerController::class, 'index'])->name('farmers.index');

Route::get('/crops', [CropController::class, 'index'])->name('crops.index');
Route::get('crops/{crop}', [CropController::class, 'show'])->name('crops.show');

Route::middleware('auth')->group(function () {
    Route::get('/pending', function() {
        if (Auth::user()->isApproved) {
            return redirect()->route('farmers.index');
        } return Inertia::render('index');
    })->name('pending');
});

// --------------------------------------------------------
// Auth Routes for Farmers
// --------------------------------------------------------
Route::middleware(['approved.farmer'])->group(function () {
    Route::get('/profile', [FarmerProfileController::class, 'show'])->name('profile.edit');
    Route::patch('/profile', [FarmerProfileController::class, 'update'])->name('profile.update');
});

require __DIR__.'/auth.php';
