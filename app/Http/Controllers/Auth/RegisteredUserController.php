<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Barangay;
use App\Models\Farmer;
use App\Models\Municipality;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(Request $request): Response
    {
        $municipalities = Municipality::select('id', 'name', 'latitude', 'longitude')->get();
        $barangays = $request->municipality_id
            ? Barangay::where('municipality_id', $request->municipality_id)
            ->select('id', 'name')
            ->get()
            : [];

        return Inertia::render('auth/register/index', [
            'municipalities' => $municipalities,
            'barangays' => $barangays,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:farmer,dealer',
        ];

        if ($request->role === 'farmer') {
            $rules = array_merge($rules, [
                'municipality_id' => 'required|exists:municipalities,id',
                'barangay_id' => 'required|exists:barangays,id',
                'latitude' => 'required|numeric|between:-90,90',
                'longitude' => 'required|numeric|between:-180,180',
                'farm_image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
        }

        $request->validate($rules);

        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone_number' => $request->phone_number,
            ]);

            if ($request->role === 'farmer') {
                Farmer::create([
                    'user_id' => $user->id,
                    'municipality_id' => $request->municipality_id,
                    'barangay_id' => $request->barangay_id,
                    'latitude' => $request->latitude,
                    'longitude' => $request->longitude,
                    'farm_image_path' => $request->hasFile('farm_image_path') 
                        ? $request->file('farm_image_path')->store('farmers', 'public')
                        : null,
                ]);
            }

            $roleName = $request->role;
            $role = Role::where('name', $roleName)->first();

            if ($role) {
                $user->roles()->attach($role);
            }

            DB::commit();

            event(new Registered($user));

            Auth::login($user);

            return redirect('/')->with('success', 'User created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
