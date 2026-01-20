<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlantingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->plant_id,
            'crop_name' => $this->crop->name,
            'crop_image' => $this->crop->image_path,
            'category' => $this->crop->category->name,
            'date_planted' => $this->date_planted->format('M d, Y'),
            'expected_harvest_date' => $this->expected_harvest_date?->format('M d, Y'),
            'date_harvested' => $this->date_harvested?->format('M d, Y'),
            'yield_kg' => $this->yield_kg,
            'status' => $this->status,
            'status_badge' => $this->status_badge,
            'days_until_harvest' => $this->days_until_harvest,
            'is_editable' => $this->status === 'active',
        ];
    }
}
