<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePlantingRequest extends FormRequest
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
            'crop_id' => [
                'required',
                'exists:crops,id',
            ],
            'date_planted' => [
                'required',
                'date',
                'before_or_equal:today',
            ],
            'expected_harvest_date' => [
                'nullable',
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
            'crop_id.required' => 'Please select a crop to plant.',
            'crop_id.exists' => 'Selected crop does not exist.',
            'date_planted.before_or_equal' => 'Planting date cannot be in the future.',
            'expected_harvest_date.after' => 'Harvest date must be after planting date.',
        ];
    }
}
