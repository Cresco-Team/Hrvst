<?php

namespace App\Policies;

use App\Models\Farmer;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class FarmerPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isApproved;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Farmer $farmer): bool
    {
        return $farmer->user->isApproved;
    }

    public function viewActivePlantings(User $user, Farmer $farmer): bool
    {
        return $farmer->user->isApproved;
    }

    public function contact(User $user, Farmer $farmer): bool
    {
        return $user->hasRole('dealer') && $farmer->user->isApproved;
    }
}
