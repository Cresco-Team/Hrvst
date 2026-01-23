<?php

use App\Http\Controllers\Admin\AdminCropController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminDemoController;
use App\Http\Controllers\Admin\AdminFarmerController;
use App\Http\Controllers\Admin\AdminGisController;
use App\Http\Controllers\Admin\AdminPriceController;
use App\Http\Controllers\CropController;
use App\Http\Controllers\Dealer\DealerMarketplaceController;
use App\Http\Controllers\DealerProfileController;
use App\Http\Controllers\DealerSearchController;
use App\Http\Controllers\FarmerController;
use App\Http\Controllers\Farmer\FarmerPlantingController;
use App\Http\Controllers\FarmerProfileController;
use App\Http\Controllers\PriceTrends;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/* Home Page */
Route::get('/', function () {
    return Inertia::render('index', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');

/* Default Pages */
Route::get('/farmers', [FarmerController::class, 'index'])->name('farmers.index');
Route::get('/crops', [CropController::class, 'index'])->name('crops.index');
Route::get('crops/{crop}', [CropController::class, 'show'])->name('crops.show');

// --------------------------------------------------------
// Admin Only Page
// --------------------------------------------------------
Route::middleware(['auth', 'admin'])->prefix('admin')->as('admin.')->group(function () {

    Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');

    /* Vegetable Spreadsheet */
    Route::resource('crops', AdminCropController::class);
    Route::resource('crops.prices', AdminPriceController::class)->only(['create', 'store']);

    Route::get('/prices', [AdminPriceController::class, 'index'])->name('prices.index');

    Route::get('/price-trends', PriceTrends::class)->name('price-trends');
    
    /* Farmers Dashboard */
    Route::get('farmers', [AdminFarmerController::class, 'index'])->name('farmers.index');
    // No farmers create and store
    Route::get('/farmers/pending/{farmer}', [AdminFarmerController::class, 'show'])->name('farmers.show');
    // No farmers edit and update
    Route::post('/farmers/pending/{user}/approve', [AdminFarmerController::class, 'approve'])->name('farmers.approve'); // Approve Pending Farmers
    Route::delete('/farmers/pending/{user}/delete', [AdminFarmerController::class, 'delete'])->name('farmers.delete');    // Reject Pending Farmers

    Route::get('geolocation', [AdminGisController::class, 'index'])->name('gis.index');
    Route::get('demographics', [AdminDemoController::class, 'index'])->name('demo.index');
});

// --------------------------------------------------------
// Dealer Only Page
// --------------------------------------------------------
Route::middleware(['auth', 'dealer'])->prefix('dealer')->as('dealer.')->group(function () {
    Route::get('/profile', [DealerProfileController::class, 'show'])->name('profile.show');

    Route::middleware(['approved'])->group(function () {
        Route::get('/marketplace', [DealerMarketplaceController::class, 'index'])
            ->name('marketplace.index');
    
        Route::get('/farmers/{farmer}', [DealerMarketplaceController::class, 'showFarmer'])
            ->name('farmers.show');
    });
});

// --------------------------------------------------------
// Farmer Only Page
// --------------------------------------------------------
Route::middleware(['auth', 'farmer'])->prefix('farmer')->as('farmer.')->group(function () {

    Route::get('/profile', [FarmerProfileController::class, 'show'])->name('show');
    
    Route::get('/plantings', [FarmerPlantingController::class, 'index'])
        ->name('plantings.index');
    
    Route::post('/plantings', [FarmerPlantingController::class, 'store'])
        ->name('plantings.store');
    
    Route::patch('/plantings/{planting}', [FarmerPlantingController::class, 'update'])
        ->name('plantings.update');
    
    Route::post('/plantings/{planting}/harvest', [FarmerPlantingController::class, 'harvest'])
        ->name('plantings.harvest');
    
    Route::delete('/plantings/{planting}', [FarmerPlantingController::class, 'destroy'])
        ->name('plantings.destroy');
});

require __DIR__.'/auth.php';