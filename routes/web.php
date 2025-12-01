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

Route::get('/', function () {
    return Inertia::render('Index', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// --------------------------------------------------------
// Public API routes for registration (No auth required)
// --------------------------------------------------------
Route::get('/public-api/barangays', function (Request $request) {
    $municipalityId = $request->input('municipality_id');
    $barangays = \App\Models\Barangay::where('municipality_id', $municipalityId)->get();
    return response()->json($barangays);
});

Route::middleware('auth')->group(function () {
    Route::get('/pending', function() {
        if (Auth::user()->isApproved) {
            return redirect()->route('crop.index');
        } return Inertia::render('Auth/Pending');
    })->name('pending');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');

// --------------------------------------------------------
// For All Users (Doesn't Requires checks)
// --------------------------------------------------------

Route::get('/crops', [CropController::class, 'index'])->name('crops');

// --------------------------------------------------------
// Dedicated Farmer Group (Requires ALL checks: auth, verified, farmer)
// --------------------------------------------------------
Route::middleware(['auth', 'verified', 'approved.farmer'])->group(function () {
    Route::get('/farmers', [FarmerController::class, 'index'])->name('farmers.index');
    Route::get('/farmers/{farmer}', [FarmerController::class, 'show'])->name('farmers.show');

    Route::get('/profile', [FarmerProfileController::class, 'show'])->name('profile.edit');
    Route::patch('/profile', [FarmerProfileController::class, 'update'])->name('profile.update');


    Route::get('/api/barangays', [FarmerController::class, 'getBarangays'])->name('farmer.api.barangays');
});

// --------------------------------------------------------
// Dedicated Admin Group (Requires ALL checks: auth, verified, admin)
// --------------------------------------------------------
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    //Crops
    Route::get('/crops', [AdminCropController::class, 'index'])->name('admin.crops.index'); // Read
    Route::get('/crops/create', [AdminCropController::class, 'create'])->name('admin.crops.create'); // Create
    Route::post('/crops', [AdminCropController::class, 'store'])->name('admin.crops.store'); // Store
    Route::post('/crops/{crop}', [AdminCropController::class, 'update'])->name('admin.crops.update'); // Update
    Route::delete('/crops/{crop}', [AdminCropController::class, 'destroy'])->name('admin.crops.destroy'); //Delete
    // Farmers
    Route::get('/farmers', [AdminFarmerController::class, 'index'])->name('admin.farmers.index');           // Fetch all Farmers
    Route::get('/farmers/{farmer}', [AdminFarmerController::class, 'show'])->name('admin.farmers.show');    // Fetch a Specific Farmer
    // Pending Farmers
    Route::post('/farmers/{user}/approve', [AdminFarmerController::class, 'approve'])->name('admin.farmers.approve'); // Approve Pending Farmers
    Route::delete('/farmers/{user}/reject', [AdminFarmerController::class, 'reject'])->name('admin.farmers.reject');    // Reject Pending Farmers

    Route::get('/api/barangays', [AdminFarmerController::class, 'getBarangays'])->name('admin.api.barangays');
});

require __DIR__.'/auth.php';
