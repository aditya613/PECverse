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
        Schema::create('mess_menus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mess_id')->constrained('messes')->onDelete('cascade');
            $table->tinyInteger('day_of_week'); // 1 = Monday, 7 = Sunday
            $table->string('meal_type'); // Breakfast, Lunch, Snacks, Dinner
            $table->text('items'); // e.g., "Aloo Paratha, Curd, Tea"
            $table->timestamps();

            $table->unique(['mess_id', 'day_of_week', 'meal_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mess_menus');
    }
};
