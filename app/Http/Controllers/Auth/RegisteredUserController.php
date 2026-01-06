<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Crop;
use App\Models\Farmer;
use App\Models\Municipality;
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
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        $municipalities = Municipality::all();
        $categories = Category::with('crops')->get();
        $crops = Crop::with('category')->get();

        return Inertia::render('auth/register/index', [
            'municipalities' => $municipalities,
            'categories' => $categories,
            'crops' => $crops,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone_number' => 'required|string|max:20',
            'municipality_id' => 'required|exists:municipalities,id',
            'barangay_id' => 'required|exists:barangays,id',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'crops' => 'nullable|array|min:1|max:3',
            'crops.*' => 'exists:crops,id',
        ]);

        $latitude = $request->latitude;
        $longitude = $request->longitude;

        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone_number' => $request->phone_number,
                'isAdmin' => false,
                'isApproved' => false,
            ]);

            $farmer = Farmer::create([
                'user_id' => $user->id,
                'municipality_id' => $request->municipality_id,
                'barangay_id' => $request->barangay_id,
                'latitude' => $latitude,
                'longitude' => $longitude,
                'image_path' => $request->file('image_path') ? $request->file('image_path')->store('farmer_images', 'public') : null,
            ]);

            $farmer->crops()->attach($request->crops);

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
