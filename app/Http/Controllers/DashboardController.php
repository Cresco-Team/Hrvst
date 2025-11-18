<?php

namespace App\Http\Controllers;

use App\Models\Category;

class DashboardController extends Controller
{
    public function show()
    {
        return view('dashboard', [
            'categories' => Category::all()
        ]);
    }
}
