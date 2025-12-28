<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Farmer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminGisController extends Controller
{
    public function index()
    {
        $farmers = Farmer::with([
            'user',
            'municipality',
            'barangay'
        ])->get();

        return Inertia::render('admin/farmers/geolocation/index',[
            'farmers' => $farmers,
        ]);
    }
}
