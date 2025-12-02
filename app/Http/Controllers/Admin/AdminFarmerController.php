<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Barangay;
use App\Models\Farmer;
use App\Models\Municipality;
use App\Models\Sitio;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminFarmerController extends Controller
{
    public function index(Request $request) {
        $query = Farmer::with(['user', 'municipality', 'barangay', 'crops']);

        // Filter by Municipality
        if ($request->filled('municipality_id')) {
            $query->where('municipality_id', $request->municipality_id);
        }
        //Filter by Barangay
        if ($request->filled('barangay_id')) {
            $query->where('barangay_id', $request->barangay_id);
        }

        $approvedFarmers = (clone $query)->whereHas('user', function($q) {
            $q->where('isApproved', true);
        });

        $pendingFarmers = (clone $query)->whereHas('user', function($q) {
            $q->where('isApproved', false);
        });

        $municipalities = Municipality::all();

        return Inertia::render('Farmers/Index', [
            'approvedFarmers' => $approvedFarmers->get(),
            'pendingFarmers' => $pendingFarmers->get(),
            'municipalities' => $municipalities,
            'filters' => $request->only(['municipality_id', 'barangay_id']),
        ]);
    }

// --------------------------------------------------------
// Pending Farmers Controller
// --------------------------------------------------------
    public function approve(User $user) {
        if (!$user->farmer) {
            return redirect()->back()
                ->with('error', 'The selected user is not a farmer.');
        }
        $user->update(['isApproved' => true]);

        return redirect()->back()->with('success', 'Farmer approved successfully.');
    }

    public function reject(User $user) {
        if (!$user->farmer) {
            return redirect()->back()
                ->with('error', 'User is not a Farmer.');
        } $farmer = $user->farmer;

        $farmer->forceDelete();
        $user->forceDelete();

        return redirect()->back()
            ->with('success', 'Farmer account rejected & deleted.');
    }

    public function show(Farmer $farmer) {
        $farmer->load(['user', 'municipality', 'barangay', 'crops.category']);

        return response()->json($farmer);
    }
}
