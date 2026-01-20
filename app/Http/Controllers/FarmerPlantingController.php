<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlantingRequest;
use App\Http\Requests\UpdatePlantingRequest;
use App\Http\Resources\CropResource;
use App\Http\Resources\PlantingResource;
use App\Models\Crop;
use App\Models\FarmerCrop;
use App\Services\PlantingService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class FarmerPlantingController extends Controller
{
    /**
     * Display farmer's planting dashboard
     */
    public function index(PlantingService $service): Response
    {
        $farmer = Auth::user()->farmer;

    $plantings = $service->getForFarmer($farmer->id);

    return Inertia::render('profiles/farmer/plantings/index', [
        'plantings' => PlantingResource::collection($plantings),
        'availableCrops' => CropResource::collection(
            Crop::with('category')->orderBy('name')->get()
        ),
        'stats' => $service->stats($plantings),
    ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePlantingRequest $request): RedirectResponse
    {
        $farmer = Auth::user()->farmer;
        $validated = $request->validated();

        // Calculate default expected harvest date if not provided
        if (!isset($validated['expected_harvest_date'])) {
            $crop = Crop::findOrFail($validated['crop_id']);
            $validated['expected_harvest_date'] = Carbon::parse($validated['date_planted'])
                ->addWeeks($crop->crop_weeks);
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

    /**
     * Display the specified resource.
     */
    public function show(FarmerCrop $farmerCrop)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FarmerCrop $farmerCrop)
    {
        //
    }

    /**
     * Update existing planting record (only if active)
     */
    public function update(UpdatePlantingRequest $request, FarmerCrop $planting): RedirectResponse
    {
        // Verify ownership
        if ($planting->farmer_id !== Auth::user()->farmer->id) {
            abort(403, 'Unauthorized action.');
        }

        // Only active plantings can be edited
        if ($planting->status !== 'active') {
            return back()->with('error', 'Cannot edit harvested or expired plantings.');
        }

        $planting->update($request->validated());

        return redirect()->route('farmer.plantings.index')
            ->with('success', 'Planting record updated successfully.');
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
