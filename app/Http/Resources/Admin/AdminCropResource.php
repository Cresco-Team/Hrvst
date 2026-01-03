<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminCropResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'imagePath' => $this->image_path,
            'name' => $this->name,
            'categoryName' => $this->category->name,
            'cropWeeks' => $this->crop_weeks,
            'latestPrice' => [
                'priceMin' => $this->latestPrice->price_min ?? 0,
                'priceMax' => $this->latestPrice->price_max ?? 0,
                'recordedAt' => $this->latestPrice
                    ? $this->latestPrice->recorded_at->format('M d, Y')
                    : null,
            ]
        ];
    }
}
