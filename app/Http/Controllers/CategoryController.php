<?php

namespace App\Http\Controllers;

use App\Models\Category;

class CategoryController extends Controller
{
    public function __invoke()
    {
        return Category::with('crops:id,category_id,name,price')->get()->map(function($category) {
            return [
                'category' => $category->name,
                'crops'    => $category->crops->map(fn($crop) => [
                    'name'  => $crop->name,
                    'price' => $crop->price
                ])
            ];
        });
    }
}
