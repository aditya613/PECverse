<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('session_id', 64)->index();
            $table->string('event_name', 64)->index();
            $table->string('screen_name', 64)->nullable()->index();
            $table->json('properties')->nullable();
            $table->string('platform', 16)->default('android');
            $table->string('app_version', 16)->nullable();
            $table->timestamp('created_at')->useCurrent()->index();

            // Composite index for fast analytical reporting
            $table->index(['event_name', 'created_at']);
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};
