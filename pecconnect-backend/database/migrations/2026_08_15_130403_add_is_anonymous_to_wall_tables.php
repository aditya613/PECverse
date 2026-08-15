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
        Schema::table('wall_posts', function (Blueprint $table) {
            $table->boolean('is_anonymous')->default(true)->after('content');
        });

        Schema::table('wall_comments', function (Blueprint $table) {
            $table->boolean('is_anonymous')->default(true)->after('content');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wall_posts', function (Blueprint $table) {
            $table->dropColumn('is_anonymous');
        });

        Schema::table('wall_comments', function (Blueprint $table) {
            $table->dropColumn('is_anonymous');
        });
    }
};
