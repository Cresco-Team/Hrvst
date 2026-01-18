<?php

namespace App\Observers;

use App\Models\Farmer;
use App\Models\Role;
use Illuminate\Support\Facades\Log;

class FarmerObserver
{
    /**
     * Handle the Farmer "created" event.
     */
    public function created(Farmer $farmer): void
    {
        Log::info('Farmer created' . $farmer->id);
        $role = Role::where('name', 'farmer')->first();

        if ($role && $farmer->user) {
            $farmer->user->roles()->syncWithoutDetaching([$role->id]);
        }
    }

    /**
     * Handle the Farmer "updated" event.
     */
    public function updated(Farmer $farmer): void
    {
        //
    }

    /**
     * Handle the Farmer "deleted" event.
     */
    public function deleted(Farmer $farmer): void
    {
        //
    }

    /**
     * Handle the Farmer "restored" event.
     */
    public function restored(Farmer $farmer): void
    {
        //
    }

    /**
     * Handle the Farmer "force deleted" event.
     */
    public function forceDeleted(Farmer $farmer): void
    {
        //
    }
}
