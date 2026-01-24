<?php

namespace App\Http\Resources\Dealer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MarketplacePlantingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->plant_id,
            'farmer' => [
                'id' => $this->farmer->id,
                'name' => $this->farmer->user->name,
                'phone' => $this->farmer->user->phone_number,
                'municipality' => $this->farmer->municipality->name,
                'barangay' => $this->farmer->barangay->name,
                'location' => [
                    'lat' => $this->farmer->latitude,
                    'lng' => $this->farmer->longitude,
                ],
            ],
            'crop' => [
                'id' => $this->crop->id,
                'name' => $this->crop->name,
                'category' => $this->crop->category->name,
                'image' => $this->crop->image_path,
            ],
            'date_planted' => $this->date_planted->format('M d, Y'),
            'expected_harvest_date' => $this->expected_harvest_date?->format('M d, Y'),
            'days_until_harvest' => $this->days_until_harvest,
            'yield_kg' => $this->yield_kg,
            'status_badge' => $this->status_badge,
        ];
    }
}
