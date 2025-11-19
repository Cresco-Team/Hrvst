<?php

namespace App\Http\Controllers;

use App\Models\Crop;
use Illuminate\Http\Request;

class CropController extends Controller
{
    public function index()
    {
        return Crop::with('category')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string',
            'price'       => 'required|numeric|min:0'
        ]);

        return Crop::create($data);
    }

    public function show(Crop $crop)
    {
        return $crop->load('category');
    }

    public function update(Request $request, Crop $crop)
    {
        $data = $request->validate([
            'name'        => 'sometimes|string',
            'price'       => 'sometimes|numeric|min:0'
        ]);

        $crop->update($data);
        return $crop;
    }

    public function destroy(Crop $crop)
    {
        $crop->delete();
        return response()->noContent();
    }

}
