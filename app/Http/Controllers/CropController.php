<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Crop;
use App\Models\Farmer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CropController extends Controller
{
    public function index(Request $request)
    {
        $query = Crop::with('category');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $crops = $query->get();
        $categories = Category::all();
        $pendingFarmers = [];
        if (Auth::check() && Auth::user()->isAdmin) {
            $pendingFarmers = Farmer::with(['user','municipality','barangay','crops'])
                ->whereHas('user', function($q){ $q->where('isApproved', false); })
                ->get();
        }

        return Inertia::render('Crops/Index', [
            'crops' => $crops,
            'categories' => $categories,
            'pendingFarmers' => $pendingFarmers,
            'filters' => $request->only(['category_id', 'search']),
        ]);
    }
}
