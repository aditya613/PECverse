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
        Schema::create('venues', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique(); // e.g. L21, 305, CL14, DS Lab
            $table->string('name', 100);          // e.g. Lecture Hall 21, Classroom 305
            $table->enum('type', ['lecture_hall', 'classroom', 'lab'])->default('classroom');
            $table->string('floor', 50)->nullable();
            $table->integer('capacity')->nullable();
            $table->timestamps();
        });

        Schema::create('venue_occupancies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venue_id')->constrained('venues')->onDelete('cascade');
            $table->unsignedTinyInteger('day_of_week'); // 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri
            $table->unsignedTinyInteger('slot_index');  // 1 to 9
            $table->string('time_label', 50);          // e.g. "8-9", "9-10", "5-7 PM"
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_occupied')->default(false);
            $table->string('occupied_by')->nullable();
            $table->timestamps();

            $table->index(['day_of_week', 'slot_index', 'is_occupied'], 'vo_day_slot_occ_idx');
            $table->index(['venue_id', 'day_of_week'], 'vo_venue_day_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venue_occupancies');
        Schema::dropIfExists('venues');
    }
};
