<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\Farmer;
use App\Models\Municipality;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FarmerController extends Controller
{
    public function index(Request $request) {
        $query = Farmer::with(['user', 'municipality', 'barangay', 'crops'])
            ->whereHas('user', function($q) {
                $q->where('isApproved', true);
            });

            if ($request->filled('municipality_id')) {
                $query->where('municipality_id', $request->municipality_id);
            }

            if ($request->filled('barangay_id')) {
                $query->where('barangay_id', $request->barangay_id);
            }

            $farmers = $query->get();
            $municipalities = Municipality::all();
            $barangays = Barangay::all();
            $pendingFarmers = [];
            if (Auth::check() && Auth::user()->isAdmin) {
                $pendingFarmers = Farmer::with(['user','municipality','barangay','crops'])
                    ->whereHas('user', function($q){ $q->where('isApproved', false); })
                    ->get();
            }

            return Inertia::render('Farmers/Index', [
                'farmers' => $farmers,
                'municipalities' => $municipalities,
                'barangays' => $barangays,
                'pendingFarmers' => $pendingFarmers,
                'filters' => $request->only(['municipality_id', 'barangay_id']),
            ]);
    }

    public function show(Farmer $farmer)
    {
        if (!$farmer->user->isApproved) {
            abort(404);
        }

        $farmer->load(['user', 'municipality', 'barangay', 'crops.category']);

        return Inertia::render('Farmers/Show', [
            'farmer' => $farmer,
        ]);
    }

    public function getBarangays(Request $request)
    {
        $barangays = Barangay::where('municipality_id', $request->municipality_id)->get();
        return response()->json($barangays);
    }
}
