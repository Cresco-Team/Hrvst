<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FarmersController;
use App\Http\Controllers\MeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', [DashboardController::class, 'show']);

Route::get('/farmers', FarmersController::class);

Route::get('/me', MeController::class);





Route::get('/welcome', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
