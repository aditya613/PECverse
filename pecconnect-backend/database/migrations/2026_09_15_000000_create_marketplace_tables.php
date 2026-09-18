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
        Schema::create('marketplace_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title', 100);
            $table->text('description');
            $table->unsignedInteger('price')->default(0); // In INR (0 = Free/Donation)
            $table->string('category', 50)->default('others'); // cycles, academics, hostel, electronics, fashion, others
            $table->string('condition', 50)->default('good');   // like_new, good, fair
            $table->string('location', 100)->nullable();        // e.g. Aravali, Shivalik, Campus
            $table->string('contact_whatsapp', 25)->nullable();
            $table->string('contact_phone', 25)->nullable();
            $table->text('image_url')->nullable();
            $table->enum('status', ['available', 'sold'])->default('available');
            $table->timestamps();

            $table->index(['status', 'category', 'created_at'], 'mkt_status_cat_created_idx');
            $table->index(['user_id', 'status'], 'mkt_user_status_idx');
            $table->index('price', 'mkt_price_idx');
        });

        Schema::create('marketplace_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('marketplace_item_id')->constrained('marketplace_items')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('reason', 255);
            $table->timestamps();

            $table->unique(['marketplace_item_id', 'user_id'], 'mkt_item_user_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marketplace_reports');
        Schema::dropIfExists('marketplace_items');
    }
};
