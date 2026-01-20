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

            $table->string('yield_kg')->nullable()      ->comment('The estimated kilograms that will be produced');
            $table->date('date_planted')->nullable()    ->comment('Date when the farmer planted the crop');
            $table->date('expected_harvest_date')->nullable()->comment('Farmer-customizable harvest date, defaults to date_planted + crop_weeks');
            $table->date('date_harvested')->nullable()  ->comment('Date for harvest and deletion of the data');

            $table->enum('status', ['active', 'harvested', 'expired']);
                  // The fields are still nullable until we implement it in the frontend.
                  // For now, let's just leave it empty/nullable.
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
