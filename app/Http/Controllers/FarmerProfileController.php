<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Crop;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class FarmerProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        // Load farmer with only active crops
        $farmer = $user->farmer->load([
            'municipality', 
            'barangay', 
            'crops' => function ($query) {
                $query->wherePivot('status', 'active');
            },
            'crops.category'
        ]);
        $allCrops = Crop::with('category')->get();

        return Inertia::render('profiles/farmer/index', [
            'farmer' => $farmer,
            'allCrops' => $allCrops,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $farmer = $user->farmer;

        $validated = $request->validate([
            'phone_number' => 'required|string|max:20',
            'crops' => 'required|array|min:1|max:3',
            'crops.*' => 'exists:crops,id',
            'crops_planted_at' => 'nullable|array',
            'crops_planted_at.*' => 'nullable|date',
        ]);

        $farmer->update([
            'phone_number' => $validated['phone_number'],
        ]);

        // Prepare sync data with planted_at timestamps
        $syncData = [];
        foreach ($validated['crops'] as $cropId) {
            $syncData[$cropId] = [
                'planted_at' => $validated['crops_planted_at'][$cropId] ?? now(),
                'status' => 'active',
            ];
        }

        $farmer->crops()->sync($syncData);

        return Redirect::route('farmer.profile.show')
            ->with('success', 'Profile updated successfully.');
    }
}
