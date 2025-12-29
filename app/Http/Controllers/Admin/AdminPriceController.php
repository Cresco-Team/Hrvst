<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Crop;
use App\Models\CropPrice;
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

        CropPrice::updateOrCreate(
            [
                'crop_id' => $crop->id,
                'recorded_at' => today(),
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
    public function index(Request $request)
    {
        $period = $request->get('period', 'month');
        $categoryId = $request ->get('category_id');

        $categories = Category::all();

        // Default to first category if none selected
        if (!$categoryId && $categories->isNotEmpty()) {
            $categoryId = $categories->first()->id;
        }

        $chartData = null;
        $selectedCategory = null;

        if ($categoryId) {
            $selectedCategory = Category::with(['crops.prices' => function ($query) {
                $query->where('recorded_at', '>=', now()->subMonths(6))
                      ->orderBy('recorded_at', 'asc');
            }])->find($categoryId);

            if ($selectedCategory) {
                $chartData = $this->buildChartData($selectedCategory, $period);
            }
        }

        return Inertia::render('admin/prices/index', [
            'categories' => $categories,
            'selectedCategoryId' => $categoryId,
            'chartData' => $chartData,
            'currentPeriod' => $period,
        ]);
    }

    private function buildChartData($category, $period)
    {
        $datasets = [];
        $allLabels = collect();

        foreach ($category->crops as $crop) {
            $groupedPrices = collect();

            foreach ($crop->prices as $price) {
                $label = $this->formatPeriodLabel($price->recorded_at, $period);
                
                if (!$groupedPrices->has($label)) {
                    $groupedPrices->put($label, [
                        'sum_min' => (float) $price->price_min,
                        'sum_max' => (float) $price->price_max,
                        'count' => 1,
                    ]);
                } else {
                    $existing = $groupedPrices->get($label);
                    $groupedPrices->put($label, [
                        'sum_min' => $existing['sum_min'] + (float) $price->price_min,
                        'sum_max' => $existing['sum_max'] + (float) $price->price_max,
                        'count' => $existing['count'] + 1,
                    ]);
                }

                $allLabels->push($label);
            }

            if ($groupedPrices->isNotEmpty()) {
                $priceData = [];
                $sortedLabels = $allLabels->unique()->sort()->values();

                foreach ($sortedLabels as $label) {
                    if ($groupedPrices->has($label)) {
                        $data = $groupedPrices->get($label);
                        $avgMin = $data['sum_min'] / $data['count'];
                        $avgMax = $data['sum_max'] / $data['count'];
                        $avgPrice = ($avgMin + $avgMax) / 2;
                        $priceData[] = round($avgPrice, 2);
                    } else {
                        $priceData[] = null;
                    }
                }

                $datasets[] = [
                    'label' => $crop->name,
                    'data' => $priceData,
                ];
            }
        }

        return [
            'labels' => $allLabels->unique()->sort()->values()->toArray(),
            'datasets' => $datasets,
        ];
    }
    
    private function formatPeriodLabel($date, $period)
    {
        $carbon = Carbon::parse($date);

        return match($period) {
            'week' => $carbon->format('Y') . '-W' . $carbon->week,
            'month' => $carbon->format('Y-m'),
            'year' => $carbon->format('Y'),
            default => $carbon->format('Y-m'),
        };
    }

}   