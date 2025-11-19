<?php

namespace App\Http\Controllers;

use App\Models\Category;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $categories = Category::with('crops:id,category_id,name,price')->get()->map(function($category) {
            return [
                'name' => $category->name,
                'crops'    => $category->crops->map(fn($crop) => [
                    'name'  => $crop->name,
                    'price' => $crop->price
                ])
            ];
        });

        return view('dashboard', compact('categories'));
    }
}
