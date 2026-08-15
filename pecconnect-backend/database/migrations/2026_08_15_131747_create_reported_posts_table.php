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
        Schema::create('reported_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wall_post_id')->constrained()->cascadeOnDelete();
            $table->string('reporter_device_id');
            $table->string('reason');
            $table->string('status')->default('pending'); // pending, reviewed, dismissed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reported_posts');
    }
};
