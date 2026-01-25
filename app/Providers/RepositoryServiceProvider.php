<?php

namespace App\Providers;

use App\Repositories\ConversationRepository;
use App\Repositories\FarmerRepository;
use App\Repositories\MessageRepository;
use App\Repositories\PlantingRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(FarmerRepository::class);
        $this->app->singleton(PlantingRepository::class);
        $this->app->singleton(ConversationRepository::class);
        $this->app->singleton(MessageRepository::class);
    }
}