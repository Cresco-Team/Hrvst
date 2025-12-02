<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Crop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminCropController extends Controller
{
    public function index()
    {
        $crops = Crop::with('category')->get();
        $categories = Category::all();

        return Inertia::render('Crops/Index', [
            'crops' => $crops,
            'categories' => $categories,
        ]);
    }

    public function create(Request $request, Crop $crop)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0|max:999999.99',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('crops', 'public');
            $validate['image'] = $path;
        }

        $crop->create($validate);



        return redirect()->route('crops.index')
            ->with('success', 'Crop created successfully.');
    }

    public function update(Request $request, Crop $crop)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0|max:999999.99',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($crop->image) {
                Storage::disk('public')->delete($crop->image);
            }

            $path = $request->file('image')->store('crops', 'public');
            $validated['image'] = $path;
        }

        $crop->update($validated);

        return redirect()->route('crops.index')
            ->with('success', 'Crop updated successfully.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0|max:999999.99',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('crops', 'public');
            $validated['image'] = $path;
        }

        Crop::create($validated);

        return redirect()->route('crops.index')
            ->with('success', 'Crop created successfully.');
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
