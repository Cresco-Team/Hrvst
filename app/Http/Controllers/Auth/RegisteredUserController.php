<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Barangay;
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
        $barangays = $request->municipalityId
            ? Barangay::where('municipality_id', $request->municipalityId)
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
        dd($request);
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phoneNumber' => 'required|string|max:20',
            'municipalityId' => 'required|exists:municipalities,id',
            'barangayId' => 'required|exists:barangays,id',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'imagePath' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone_number' => $request->phoneNumber,
                'municipality_id' => $request->municipalityId,
                'barangay_id' => $request->barangayId,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'image_path' => $request->imagePath,
            ]);

            $userRole = Role::where('name', 'user')->first();

            $user->roles()->attach($userRole);

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
