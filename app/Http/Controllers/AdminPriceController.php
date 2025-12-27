<?php

namespace App\Http\Controllers;

use App\Models\Crop;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPriceController extends Controller
{
    public function index()
    {
        $crops = Crop::with([
            'category',
            'latestPrice:id,crop_id,price_min,price_max,recorded_at'
        ])->get();

        return Inertia::render('admin/crops/crop/index', [
            'crops' => $crops,
        ]);
    }
}
