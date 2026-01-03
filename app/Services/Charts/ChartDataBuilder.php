<?php

namespace App\Services\Charts;

use Illuminate\Support\Collection;

class ChartDataBuilder
{
    public function build(Collection $items, callable $labelResolver, array $datasets): array
    {
        return [
            'labels' => $items->map($labelResolver)->values(),
            'datasets' => collect($datasets)->map(function ($dataset) use ($items) {
                return [
                    'label' => $dataset['label'],
                    'data' => $items->map($dataset['value'])->values(),
                ];
            })->values(),
        ];
    }
}
