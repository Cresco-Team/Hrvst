<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Crop;
use App\Models\CropPrice;
use App\Services\PriceChartService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPriceController extends Controller
{
    /* 
        This is for the pricing of a Crop
    */
    public function create(Crop $crop)
    {
        $crop->load(['category', 'latestPrice']);

        return Inertia::render('admin/prices/create', [
            'crop' => $crop,
        ]);
    }

    public function store(Request $request, Crop $crop)
    {
        $validated = $request->validate([
            'price_min' => 'required|numeric|min:0|max:999.99|lte:price_max',
            'price_max' => 'required|numeric|min:0|max:999.99|gte:price_min',
        ]);

        $saturday = Carbon::now()->next(Carbon::SATURDAY);
        if (Carbon::now()->isSaturday()) {
            $saturday = Carbon::today();
        }

        CropPrice::updateOrCreate(
            [
                'crop_id' => $crop->id,
                'recorded_at' => $saturday,
            ],
            [
                'price_min' => $validated['price_min'],
                'price_max' => $validated['price_max'],
            ]
        );

        return redirect()
            ->route('admin.crops.show', $crop)
            ->with('success', 'Price updated successfully.');
    }

    /* 
        This is for the Prices Insight Page
    */
    public function index(Request $request, PriceChartService $chartService)
    {
        $period = $request->get('period', 'month');
        $categoryId = $request->get('category_id');
    
        $categories = Category::all();
    
        if (!$categoryId) {
            $categoryId = $categories->first()->id;
        }

        $chartData = null;
    
        if ($categoryId) {
            $category = Category::with(['crops.prices' => function ($q) {
                $q->where('recorded_at', '>=', now()->subMonths(6))
                  ->orderBy('recorded_at');
            }])->find($categoryId);
    
            if ($category) {
                $chartData = $chartService->build($category, $period);
            }
        }
    
        return Inertia::render('admin/prices/index', [
            'categories' => $categories,
            'selectedCategoryId' => $categoryId,
            'chartData' => $chartData,
            'currentPeriod' => $period,
        ]);
    }
}   