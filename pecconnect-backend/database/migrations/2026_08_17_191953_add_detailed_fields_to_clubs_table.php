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
        Schema::table('clubs', function (Blueprint $table) {
            $table->text('long_description')->nullable()->after('description');
            $table->string('faculty_advisor')->nullable()->after('long_description');
            $table->string('join_link')->nullable()->after('faculty_advisor');
            $table->string('website_link')->nullable()->after('join_link');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clubs', function (Blueprint $table) {
            $table->dropColumn(['long_description', 'faculty_advisor', 'join_link', 'website_link']);
        });
    }
};
