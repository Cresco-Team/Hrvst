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
        Schema::create('farmer_crop', function (Blueprint $table) {
            $table->id('plant_id');
            $table->foreignId('farmer_id')->constrained('farmers')->onDelete('cascade');
            $table->foreignId('crop_id')->constrained('crops')->onDelete('cascade');
            $table->string('yield_kg')->nullable();         // Actual Kilograms produced
            $table->date('planting_date')->nullable();      // Exact Date
            $table->date('harvesting_date')->nullable();    // Expected Harvesting Date
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('farmer_crop');
    }
};
