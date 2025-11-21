<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class FarmerApprovalController extends Controller
{
    public function index()
    {
        $farmers = User::where('role', 'farmer')
                              ->where('status', 'pending')
                              ->get();

        return inertia('Admin/FarmersApproval', [
            'farmers' => $farmers,
        ]);
    }

    public function approveAll()
    {
        $farmers = User::where('role', 'farmer')
            ->where('status', 'pending')
            ->update(['status' => 'approved']);

        return inertia('Admin/FarmersApproval', [
            'farmers' => $farmers
        ]);
    }

    public function approve($id)
    {
        $farmer = User::findOrFail($id);
        $farmer->update(['status' => 'approved']);

        return back();
    }
}
