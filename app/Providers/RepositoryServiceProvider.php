<?php

namespace App\Providers;

use App\Repositories\FarmerRepository;
use App\Repositories\PlantingRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(FarmerRepository::class);
        $this->app->singleton(PlantingRepository::class);
    }
}