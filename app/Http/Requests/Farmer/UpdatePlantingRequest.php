<?php

namespace App\Http\Requests\Farmer;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlantingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->hasRole('farmer') && $this->user()->isApproved;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date_planted' => [
                'sometimes',
                'date',
                'before_or_equal:today',
            ],
            'expected_harvest_date' => [
                'sometimes',
                'date',
                'after:date_planted',
            ],
            'yield_kg' => [
                'nullable',
                'numeric',
                'min:0',
                'max:999999.99',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'date_planted.before_or_equal' => 'Planting date cannot be in the future.',
            'expected_harvest_date.after' => 'Harvest date must be after planting date.',
        ];
    }
}
