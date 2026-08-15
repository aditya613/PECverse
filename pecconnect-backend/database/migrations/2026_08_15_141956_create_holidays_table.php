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
        Schema::create('holidays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
            $table->date('date');
            $table->string('reason')->nullable();
            $table->foreignId('declared_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->unique(['class_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('holidays');
    }
};
