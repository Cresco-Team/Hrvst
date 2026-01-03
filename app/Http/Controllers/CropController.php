<?php

namespace App\Http\Controllers;

use App\Models\Crop;
use App\Models\Category;
use App\Services\CropService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CropController extends Controller
{
    public function index(Request $request, CropService $cropService)
    {
        $crops = $cropService->getFilteredCrops($request->only(['category_id', 'search']));
        
        $categories = Category::withCount('crops')->get();

        return Inertia::render('crops/index', [
            'crops' => $crops,
            'categories' => $categories,
            'filters' => [
                'category_id' => $request->category_id,
                'search' => $request->search,
            ],
        ]);
    }

    public function show(Crop $crop)
    {
        
    }

    public function weekly($id)
    {
        $data = DB::table('crops')
            ->selectRaw('
                strftime("%Y-%W", recorded_at) as week,
                AVG((price_min + price_max) / 2.0) as avg_price
            ')
            ->where('crop_id', $id)
            ->groupBy('week')
            ->orderBy('week')
            ->get();

        return response()->json([
            'labels' => $data->pluck('week'),
            'data' => $data->pluck('avg_price')
        ]);
    }
}