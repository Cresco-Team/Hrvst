<x-layout>
    <x-slot:heading>
        Dashboard
    </x-slot:heading>

    <main class="space-y-8 p-4">

        @foreach($categories as $category)
            <section>
                <h2 class="text-2xl font-bold mb-4">{{ $category['name'] }}</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    @foreach($category['crops'] as $crop)
                        <div class="bg-white shadow rounded-lg p-4 flex flex-col items-center text-center hover:shadow-lg transition">
                            @if(!empty($crop['image']))
                                <img src="{{ $crop['image'] }}" alt="{{ $crop['name'] }}" class="w-32 h-32 object-cover rounded mb-3">
                            @else
                                <div class="w-32 h-32 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            @endif
                            <h3 class="font-semibold text-lg">{{ $crop['name'] }}</h3>
                            <p class="text-green-600 font-bold">${{ $crop['price'] }}</p>
                        </div>
                    @endforeach
                </div>
            </section>
        @endforeach

    </main>
</x-layout>
