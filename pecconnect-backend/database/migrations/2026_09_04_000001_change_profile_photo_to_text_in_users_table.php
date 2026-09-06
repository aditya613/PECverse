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
        Schema::table('users', function (Blueprint $table) {
            $table->text('profile_photo')->nullable()->change();
        });

        if (Schema::hasTable('lost_and_found_items')) {
            Schema::table('lost_and_found_items', function (Blueprint $table) {
                $table->text('image_url')->nullable()->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('profile_photo', 255)->nullable()->change();
        });

        if (Schema::hasTable('lost_and_found_items')) {
            Schema::table('lost_and_found_items', function (Blueprint $table) {
                $table->string('image_url', 255)->nullable()->change();
            });
        }
    }
};
