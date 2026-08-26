<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lost_and_found_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['lost', 'found']);
            $table->string('title');
            $table->text('description');
            $table->string('location')->nullable();
            $table->string('image_url')->nullable();
            $table->enum('status', ['active', 'resolved'])->default('active');
            $table->date('date_lost_or_found');
            $table->timestamps();
        });

        Schema::create('lost_and_found_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained('lost_and_found_items')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('content');
            $table->timestamps();
        });

        Schema::create('lost_and_found_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained('lost_and_found_items')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('reason');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lost_and_found_reports');
        Schema::dropIfExists('lost_and_found_comments');
        Schema::dropIfExists('lost_and_found_items');
    }
};
