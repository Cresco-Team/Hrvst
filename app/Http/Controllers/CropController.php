<?php

namespace App\Http\Controllers;

use App\Models\Crop;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CropController extends Controller
{
    public function index(Request $request)
    {
        $query = Crop::with('category');

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Search by crop name
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $crops = $query->get();
        $categories = Category::withCount('crops')->get();

        return Inertia::render('Crops/Index', [
            'crops' => $crops,
            'categories' => $categories,
            'filters' => $request->only(['category_id', 'search']),
        ]);
    }
}