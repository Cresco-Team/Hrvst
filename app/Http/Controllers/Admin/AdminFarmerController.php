<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Farmer;
use App\Models\User;
use Inertia\Inertia;

class AdminFarmerController extends Controller
{
    public function index()
    {
        $relations = [
            'user',
            'municipality',
            'barangay',
            'crops'
        ];

        $approvedFarmers = Farmer::approved()->with($relations)->get();
        $pendingFarmers = Farmer::pending()->with($relations)->get();

        return Inertia::render('admin/farmers/index', [
            'approvedFarmers' => $approvedFarmers,
            'pendingFarmers' => $pendingFarmers,
        ]);
    }

// --------------------------------------------------------
// Pending Farmers Controller
// --------------------------------------------------------
    public function show(User $user) {
        $user->load(['farmer', 'municipality', 'barangay', 'crops.category']);

        return response()->json($user);
    }

    public function approve(User $user) {
        if (!$user->farmer) {
            return redirect()->back()
                ->with('error', 'The selected user is not a farmer.');
        }
        $user->update(['isApproved' => true]);

        return redirect()->back()->with('success', 'Farmer approved successfully.');
    }

    public function delete(User $user) {
        if (!$user->farmer) {
            return redirect()->back()
                ->with('error', 'User is not a Farmer.');
        } $farmer = $user->farmer;

        $farmer->forceDelete();
        $user->forceDelete();

        return redirect()->back()
            ->with('success', 'Farmer account rejected & deleted.');
    }

    
}
