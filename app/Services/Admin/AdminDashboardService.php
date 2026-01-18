<?php

namespace App\Services\Admin;

use App\Models\Crop;
use App\Models\CropPrice;
use App\Models\Municipality;
use App\Models\User;
use Carbon\Carbon;

class AdminDashboardService
{
    public function getStats()
    {
        $start = Carbon::now()->subWeeks()->startOfWeek();
        $end = Carbon::now()->endOfWeek();

        $cropsCount = Crop::count();
        $updatedPriceCount = CropPrice::whereBetween('recorded_at', [$start, $end,])->count();

        $usersCount = User::whereHas('farmer')->count();
        $activeUsersCount = User::activeUsers($start, $end)->count();

        return [
            'cropsCount' => $cropsCount,
            'updatedPriceCount' => $updatedPriceCount,
            'usersCount' => $usersCount,
            'activeUsersCount' => $activeUsersCount,
        ];
    }

    public function getPriceRanks()
    {
        $priceChanges = Crop::with(['prices' => function ($query) {
            $query->orderBy('recorded_at', 'desc')->limit(2);
        }])
        ->get()
        ->map(function ($crop) {
            $prices = $crop->prices;

            if ($prices->count() < 2) {
                return null;
            }

            $latest = $prices[0];
            $previous = $prices[1];

            $latestAvg = ($latest->price_min + $latest->price_max) / 2;
            $previousAvg = ($previous->price_min + $previous->price_max) / 2;

            if ($previousAvg == 0) {
                return null;
            }

            $percentChange = (($latestAvg - $previousAvg) / $previousAvg) * 100;

            return [
            'name' => $crop->name,
            'prevAvgPrice' => round($previousAvg, 2),
            'newAvgPrice' => round($latestAvg, 2),
            'percentChange' => round($percentChange, 2),
            ];
        })
        ->filter()
        ->values();

    return [
        'topGainers' => $priceChanges
            ->sortByDesc('percentChange')
            ->take(3)
            ->values(),

        'topLosers' => $priceChanges
            ->sortBy('percentChange')
            ->take(3)
            ->values(),
        ];
    }

    public function getCropUpdateFrequency()
    {
        $priceUpdates =  Crop::withCount('prices')
            ->with(['latestPrice:id,crop_id,recorded_at'])
            ->where('prices_count', '>', 0)
            ->orderBy('prices_count', 'asc')
            ->get()
            ->map(function ($crop) {
                return [
                    'name' => $crop->name,
                    'pricesCount' => $crop->prices_count,
                    'lastRecorded' => $crop->latestPrice?->recorded_at?->diffForHumans(),
                ];
            })
            ->filter();

        return [
            'stableCrops' => $priceUpdates->take(3)->values()->all(),
            'unstableCrops' => $priceUpdates->take(-3)->reverse()->values()->all(),
        ];
    }

    public function getMarketVolatility()
    {
        $thresholdPercentage = 15.0;

        $recentPrices = CropPrice::where('recorded_at', '>=', Carbon::now()->subDays(30))
            ->orderBy('recorded_at', 'desc')
            ->get()
            ->groupBy('crop_id');

        $volatilities = [];

        foreach ($recentPrices as $prices) {
            if ($prices->count() < 2) continue;

            $averages = $prices->map(function ($price) {
                return ($price->price_min + $price->price_max) / 2;
            });

            $mean = $averages->avg();
            $variance = $averages->map(function ($avg) use ($mean) {
                return pow($avg - $mean, 2);
            })->avg();

            $stdDev = sqrt($variance);
            $volatility = $mean > 0 ? ($stdDev / $mean) * 100 : 0;

            $volatilities[] = $volatility;
        }

        if (empty($volatilities)) {
            return [
                'averageVolatility' => 0,
                'exceedsThreshold' => false,
                'threshold' => $thresholdPercentage,
            ];
        }

        $avgVolatility = array_sum($volatilities) / count($volatilities);

        return [
            'averageVolatility' => round($avgVolatility, 2),
            'exceedsThreshold' => $avgVolatility > $thresholdPercentage,
            'threshold' => $thresholdPercentage,
        ];
    }

    public function getTopMunicipality()
    {
        $municipality = Municipality::withCount('farmers')
            ->orderBy('farmers_count', 'desc')
            ->first();

        return $municipality ? [
            'name' => $municipality->name,
            'farmersCount' => $municipality->farmers_count,
        ] : null;
    }
}
