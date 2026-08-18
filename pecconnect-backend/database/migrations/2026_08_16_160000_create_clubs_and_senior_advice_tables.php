<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clubs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('category'); // technical, cultural, sports, social
            $table->text('description')->nullable();
            $table->integer('members_count')->default(0);
            $table->string('icon_name')->default('people');
            $table->string('color')->default('#3B82F6');
            $table->string('instagram_handle')->nullable();
            $table->timestamps();
        });

        Schema::create('club_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('club_id')->constrained('clubs')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('device_id')->nullable();
            $table->timestamps();

            $table->index(['club_id', 'device_id']);
            $table->index(['club_id', 'user_id']);
        });

        Schema::create('senior_advices', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category'); // Academics, Campus Life, Societies, Hostels, Attendance
            $table->text('content');
            $table->string('author_name')->default('Senior PECian');
            $table->string('author_batch')->default('4th Year');
            $table->integer('likes_count')->default(0);
            $table->timestamps();
        });

        Schema::create('senior_questions', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->string('device_id')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->text('answer')->nullable();
            $table->string('answered_by')->nullable();
            $table->enum('status', ['pending', 'answered'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('senior_questions');
        Schema::dropIfExists('senior_advices');
        Schema::dropIfExists('club_members');
        Schema::dropIfExists('clubs');
    }
};
