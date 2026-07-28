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
        // 1. Branches Table
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('code', 20)->unique();
            $table->timestamps();
        });

        // 2. Classes Table
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->integer('year');
            $table->string('group_name', 50);
            // cr_user_id will be added later or kept nullable to avoid circular dependency with users table
            $table->unsignedBigInteger('cr_user_id')->nullable();
            $table->timestamps();
        });

        // 3. Alter Users Table
        Schema::table('users', function (Blueprint $table) {
            $table->string('google_id')->nullable()->unique()->after('email');
            $table->string('roll_no', 50)->nullable()->unique()->after('google_id');
            $table->enum('role', ['student', 'cr', 'superadmin'])->default('student')->after('roll_no');
            $table->foreignId('class_id')->nullable()->after('role')->constrained('classes')->onDelete('set null');
            $table->string('profile_photo')->nullable()->after('class_id');
            
            // Password can be nullable since we use Google SSO
            $table->string('password')->nullable()->change();
        });

        // Add foreign key to classes now that users exist
        Schema::table('classes', function (Blueprint $table) {
            $table->foreign('cr_user_id')->references('id')->on('users')->onDelete('set null');
        });

        // 4. Timetables (Unified Table for Weekly and Specific Classes)
        Schema::create('timetables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
            
            // Core Data
            $table->enum('type', ['weekly', 'single', 'cancelled', 'rescheduled'])->default('weekly');
            $table->tinyInteger('day_of_week')->nullable(); // 1 = Monday, 7 = Sunday (Used for weekly)
            $table->date('date')->nullable(); // Used for single, cancelled, rescheduled
            
            // Optional pointer to original weekly class (if this row is a cancellation/reschedule)
            $table->foreignId('original_timetable_id')->nullable()->constrained('timetables')->onDelete('cascade');
            
            // Time & Details
            $table->integer('period_no')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('subject')->nullable();
            $table->string('teacher')->nullable();
            $table->string('room', 100)->nullable();
            $table->string('reason')->nullable(); // Context for overrides
            
            $table->timestamps();
        });

        // 6. Announcements
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('body');
            $table->foreignId('posted_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('class_id')->nullable()->constrained('classes')->onDelete('cascade');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('cascade');
            $table->string('attachment_url')->nullable();
            $table->timestamps();
        });

        // 7. Notes
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subject');
            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade');
            $table->string('file_url');
            $table->string('file_type', 50)->nullable();
            $table->integer('downloads_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('timetables');
        
        Schema::table('classes', function (Blueprint $table) {
            $table->dropForeign(['cr_user_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['class_id']);
            $table->dropColumn(['google_id', 'roll_no', 'role', 'class_id', 'profile_photo']);
        });

        Schema::dropIfExists('classes');
        Schema::dropIfExists('branches');
    }
};
