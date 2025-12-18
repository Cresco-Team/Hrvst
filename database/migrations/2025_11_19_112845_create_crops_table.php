<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('crops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained();
            $table->string('name');
            $table->decimal('price_min', 5, 2)  ->comment('The minimum price of the crop');
            $table->decimal('price_max', 5, 2)  ->comment('The maximum price of the crop');
            $table->date('recorded_at')         ->comment('Record the updated prices');
            $table->string('image_path')->nullable();
            $table->timestamps();
            $table->unique(['category_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crops');
    }
};
