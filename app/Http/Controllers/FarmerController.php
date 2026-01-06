<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\Farmer;
use App\Models\Municipality;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FarmerController extends Controller
{
    public function index(Request $request)
    {
        $municipalities = Municipality::with('barangays')->get();
        
        $query = Farmer::with([
            'user', 
            'municipality', 
            'barangay', 
            'crops',
        ])->whereHas('user', function($q) {
                $q->where('isApproved', true);
            });

        if ($request->filled('municipality_id')) {
            $query->where('municipality_id', $request->municipality_id);
        }

        if ($request->filled('barangay_id')) {
            $query->where('barangay_id', $request->barangay_id);
        }
        
        if ($request->filled('municipality_id')) {
            $barangays = Barangay::where('municipality_id', $request->municipality_id)
            ->get();
        }

        // Data passed to Farmers Page as properties
        return Inertia::render('farmers/index', [
            'farmers' => $query->get(),
            'municipalities' => $municipalities,
            'filters' => $request->only(['municipality_id', 'barangay_id']),
        ]);
    }

    public function show(Farmer $farmer)
    {
        // Only show approved farmers
        if (!$farmer->user->isApproved) {
            abort(404);
        }

        // Load farmer with only active (non-expired) crops
        $farmer->load([
            'user', 
            'municipality', 
            'barangay', 
            'crops' => function ($query) {
                $query->wherePivot('status', 'active');
            },
            'crops.category'
        ]);

        return response()->json($farmer);
    }

    public function getBarangays(Request $request)
    {
        $barangays = Barangay::where('municipality_id', $request->municipality_id)
        ->select('id', 'name', 'latitude', 'longitude')
        ->get();
        return response()->json($barangays);
    }
}