<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Crop;
use App\Models\CropPrice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminCropController extends Controller
{
    public function index()
    {
        $crops = Crop::with([
            'category',
            'latestPrice:id,crop_id,price_min,price_max,recorded_at'
        ])->get();

        return Inertia::render('admin/crops/index', [
            'crops' => $crops,
        ]);
    }

    

    public function create()
    {
        $categories = Category::all();
        
        return Inertia::render('admin/crops/create', [
            'categories' => $categories,
        ]);
    }
     
    public function store(Request $request)
    {
        $validated = $request->validate([
            /* Crop Data */
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'image_path' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'crop_weeks' => 'required|numeric|min:1|max:356',
            /* Price Data */
            'price_min' => 'required|numeric|min:0|max:999.99|lte:price_max',
            'price_max' => 'required|numeric|min:0|max:999.99|gte:price_min',
            
        ]);

        try {
            DB::transaction(function () use ($validated) {
                /* Create crop */
                $crop = Crop::create([
                    'name' => $validated['name'],
                    'category_id' => $validated['category_id'],
                    'image_path' => $validated['image_path']->store('crops', 'public'),
                    'crop_weeks' => $validated['crop_weeks'],
                ]);
                CropPrice::create([
                    'crop_id' => $crop->id,
                    'price_min' => $validated['price_min'],
                    'price_max' => $validated['price_max'],
                    'recorded_at' => now()->toDateString(),
                ]);
            });
        } catch (\throwable $e) {
            dd($e->getMessage());
        }
        

        return redirect()->route('admin.crops.index')->with('success', 'Crop created successfully');
    }

    public function show(Crop $crop)
    {
        return Inertia::render('admin/crops/Show', [
            'crop' => $crop
        ]);
    }

    public function edit(Crop $crop)
    {
        $crop->load(['category', 'prices']);

        return Inertia::render('admin/crops/edit', [
            'crop' => $crop,
            'categories' => Category::all(),
        ]);
    }

    public function update(Request $request, Crop $crop)
    {
        $validated = $request->validate([
            /* Crop Data */
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'image_path' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'crop_weeks' => 'required|numeric|min:1|max:356',
            /* Price Data */
            'price_min' => 'required|numeric|min:0|max:999.99|lte:price_max',
            'price_max' => 'required|numeric|min:0|max:999.99|gte:price_min',
            
        ]);

        if ($request->hasFile('image_path')) {
            if ($crop->image_path) {
                Storage::disk('public')->delete($crop->image_path);
            }

            $path = $request->file('image_path')->store('crops', 'public');
            $validated['image_path'] = $path;
        }

        $crop->update($validated);

        return redirect()->route('crops.index')
            ->with('success', 'Crop updated successfully.');
    }

    

    public function destroy(Crop $crop)
    {
        if ($crop->image) {
            Storage::disk('public')->delete($crop->image);
        }

        $crop->delete();

        return redirect()->route('crops.index')
            ->with('success', 'Crop deleted successfully.');
    }
}
