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
        // 1. Freshers Table
        Schema::create('freshers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('branch');
            $table->string('device_id')->unique(); // UUID for pseudo-authentication
            $table->timestamps();
        });

        // 2. Wall Posts
        Schema::create('wall_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fresher_id')->constrained('freshers')->onDelete('cascade');
            $table->text('content');
            $table->integer('likes_count')->default(0);
            $table->integer('comments_count')->default(0);
            $table->timestamps();
        });

        // 3. Wall Comments
        Schema::create('wall_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wall_post_id')->constrained('wall_posts')->onDelete('cascade');
            $table->foreignId('fresher_id')->constrained('freshers')->onDelete('cascade');
            $table->text('content');
            $table->timestamps();
        });

        // 4. Wall Likes (Polymorphic for posts and comments)
        Schema::create('wall_likes', function (Blueprint $table) {
            $table->id();
            $table->string('likable_type');
            $table->unsignedBigInteger('likable_id');
            $table->string('device_id');
            $table->timestamps();

            // Prevent a device from liking the same thing twice
            $table->unique(['likable_type', 'likable_id', 'device_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wall_likes');
        Schema::dropIfExists('wall_comments');
        Schema::dropIfExists('wall_posts');
        Schema::dropIfExists('freshers');
    }
};
