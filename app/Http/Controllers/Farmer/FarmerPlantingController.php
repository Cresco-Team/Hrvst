<?php

namespace App\Http\Controllers\Farmer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Farmer\StorePlantingRequest;
use App\Http\Requests\Farmer\UpdatePlantingRequest;
use App\Http\Resources\PlantingResource;
use App\Models\Crop;
use App\Models\FarmerCrop;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class FarmerPlantingController extends Controller
{
    /**
     * Display farmer's planting dashboard
     */
    public function index(): Response
    {
        $farmer = Auth::user()->farmer;

        $plantings = FarmerCrop::where('farmer_id', $farmer->id)
            ->with('crop.category')
            ->orderByRaw("
                CASE status
                    WHEN 'active' THEN 1
                    WHEN 'harvested' THEN 2
                    WHEN 'expired' THEN 3
                END
            ")
            ->orderBy('date_planted', 'desc')
            ->get()
            ->map(function ($planting) {
                return [
                    'id' => $planting->plant_id,
                    'crop_name' => $planting->crop->name,
                    'crop_image' => $planting->crop->image_path,
                    'category' => $planting->crop->category->name,
                    'date_planted' => $planting->date_planted->format('Y-m-d'),
                    'date_planted_display' => $planting->date_planted->format('M d, Y'),
                    'expected_harvest_date' => $planting->expected_harvest_date?->format('Y-m-d'),
                    'expected_harvest_date_display' => $planting->expected_harvest_date?->format('M d, Y'),
                    'date_harvested' => $planting->date_harvested?->format('Y-m-d'),
                    'date_harvested_display' => $planting->date_harvested?->format('M d, Y'),
                    'yield_kg' => $planting->yield_kg,
                    'status' => $planting->status,
                    'status_badge' => $planting->status_badge,
                    'days_until_harvest' => $planting->days_until_harvest,
                    'is_editable' => $planting->status === 'active',
                ];
            });

        $availableCrops = Crop::with('category')
            ->orderBy('name')
            ->get()
            ->map(fn($crop) => [
                'id' => $crop->id,
                'name' => $crop->name,
                'category' => $crop->category->name,
                'crop_weeks' => $crop->crop_weeks,
                'image_path' => $crop->image_path,
            ]);

        return Inertia::render('farmer-profile/plantings/index', [
            'plantings' => $plantings,
            'availableCrops' => $availableCrops,
            'stats' => [
                'active' => $plantings->where('status', 'active')->count(),
                'harvested_this_month' => $plantings->where('status', 'harvested')
                    ->filter(fn($p) => Carbon::parse($p['date_harvested'])->isCurrentMonth())
                    ->count(),
            ],
        ]);
    }

    public function create()
    {
        $availableCrops = Crop::with('category')
            ->orderBy('name')
            ->get()
            ->map(fn($crop) => [
                'id' => $crop->id,
                'name' => $crop->name,
                'category' => $crop->category->name,
                'crop_weeks' => $crop->crop_weeks,
                'image_path' => $crop->image_path,
            ]);

        return Inertia::render('farmer-profile/plantings/create', [
            'availableCrops' => $availableCrops,
            'today' => Carbon::now()->format('Y-m-d'),
        ]);
    }

    /**
     * Store new planting record
     */
    public function store(StorePlantingRequest $request): RedirectResponse
    {
        $farmer = Auth::user()->farmer;
        $validated = $request->validated();

        // Calculate default expected harvest date if not provided
        if (!isset($validated['expected_harvest_date'])) {
            $crop = Crop::findOrFail($validated['crop_id']);
            $validated['expected_harvest_date'] = Carbon::parse($validated['date_planted'])
                ->addWeeks($crop->crop_weeks)
                ->format('Y-m-d');
        }

        FarmerCrop::create([
            'farmer_id' => $farmer->id,
            'crop_id' => $validated['crop_id'],
            'date_planted' => $validated['date_planted'],
            'expected_harvest_date' => $validated['expected_harvest_date'],
            'yield_kg' => $validated['yield_kg'] ?? null,
            'status' => 'active',
        ]);

        return redirect()->route('farmer.plantings.index')
            ->with('success', 'Planting record created successfully.');
    }

    public function edit(FarmerCrop $planting)
    {
        if ($planting->farmer_id !== Auth::user()->farmer->id) {
            abort(403, 'Unauthorized action.');
        }

        if ($planting->status !== 'active') {
            return back()
                ->with('error', 'Cannot edit harvested or expired plantings.');
        }

        return Inertia::render('farmer-profile/plantings/edit', [
            'planting' => new PlantingResource($planting),
            'today' => Carbon::now()->format('Y-m-d'),
        ]);
    }

    /**
     * Update existing planting record (only if active)
     */
    public function update(UpdatePlantingRequest $request, FarmerCrop $planting): RedirectResponse
    {
        $planting->update($request->validated());

        return redirect()->route('farmer.plantings.index')
            ->with('success', 'Your plant is updated successfully.');
    }

    /**
     * Mark planting as harvested
     */
    public function harvest(FarmerCrop $planting): RedirectResponse
    {
        if ($planting->farmer_id !== Auth::user()->farmer->id) {
            abort(403, 'Unauthorized action.');
        }

        if ($planting->status !== 'active') {
            return back()->with('error', 'Only active plantings can be harvested.');
        }

        $planting->markAsHarvested();

        return redirect()->route('farmer.plantings.index')
            ->with('success', 'Crop marked as harvested.');
    }

    /**
     * Delete planting record
     */
    public function destroy(FarmerCrop $planting): RedirectResponse
    {
        if ($planting->farmer_id !== Auth::user()->farmer->id) {
            abort(403, 'Unauthorized action.');
        }

        // Prevent deletion of harvested records (preserve historical data)
        if ($planting->status === 'harvested') {
            return back()->with('error', 'Cannot delete harvested records. Contact admin if needed.');
        }

        $planting->delete();

        return redirect()->route('farmer.plantings.index')
            ->with('success', 'Planting record deleted.');
    }
}