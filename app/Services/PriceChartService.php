<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Collection;

class PriceChartService
{
    /**
     * Create a new class instance.
     */
    public function build($category, string $period): array
    {
        $datasets = [];
        $allLabels = collect();

        foreach ($category->crops as $crop) {
            $groupedPrices = collect();

            foreach ($crop->prices as $price) {
                $label = $this->formatPeriodLabel($price->recorded_at, $period);
            
                $allLabels->push($label);
            
                $entry = $groupedPrices->get($label, [
                    'sum_min' => 0,
                    'sum_max' => 0,
                    'count'   => 0,
                ]);
            
                $entry['sum_min'] += (float) $price->price_min;
                $entry['sum_max'] += (float) $price->price_max;
                $entry['count']++;
            
                $groupedPrices->put($label, $entry);
            }

            if ($groupedPrices->isEmpty()) {
                continue;
            }

            $datasets[] = [
                'label' => $crop->name,
                'data'  => $this->alignData($groupedPrices, $allLabels),
            ];
        }

        return [
            'labels'   => $allLabels->unique()->sort()->values()->toArray(),
            'datasets' => $datasets,
        ];
    }

    private function alignData(Collection $groupedPrices, Collection $allLabels): array
    {
        $data = [];

        foreach ($allLabels->unique()->sort() as $label) {
            if (!isset($groupedPrices[$label])) {
                $data[] = null;
                continue;
            }

            $entry = $groupedPrices[$label];

            $avgMin = $entry['sum_min'] / $entry['count'];
            $avgMax = $entry['sum_max'] / $entry['count'];

            $data[] = round((($avgMin + $avgMax) / 2), 2);
        }

        return $data;
    }

    private function formatPeriodLabel($date, string $period): string
    {
        $carbon = Carbon::parse($date);

        return match ($period) {
            'week'  => $carbon->format('Y') . '-W' . $carbon->week,
            'month' => $carbon->format('Y-m'),
            'year'  => $carbon->format('Y'),
            default => $carbon->format('Y-m'),
        };
    }
}
