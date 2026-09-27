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
        Schema::create('exam_datesheets', function (Blueprint $table) {
            $table->id();
            $table->string('notice_no')->default('PEC/CSE/265');
            $table->date('notice_date')->default('2026-09-25');
            $table->string('exam_type')->default('Mid Term');
            $table->string('academic_session')->default('October 2026');
            $table->date('exam_date');                          // '2026-10-01'
            $table->string('day_name', 15);                     // 'Thursday'
            $table->string('time_slot', 30);                    // '9:30 AM - 11:00 AM'
            $table->string('start_time', 5);                    // '09:30'
            $table->string('end_time', 5);                      // '11:00'
            $table->string('branch_key', 30);                   // '3rd_cse', '5th_ai', etc.
            $table->string('semester', 20);                     // '3rd Sem', '5th Sem', etc.
            $table->string('branch_name', 50);                  // 'CSE', 'Data Science', 'AI'
            $table->string('subject_code', 50);                 // 'CTN 304', 'ES 2301 (Pool A)'
            $table->string('subject_name');                     // 'Object Oriented Programming'
            $table->text('seating_rooms')->nullable();          // 'DH1, DH2, DH3, DH4, DH5, L26 - L31'
            $table->string('coordinator_duty')->nullable();     // 'Dr. Satnam Kaur (OOP)'
            $table->boolean('is_backlog')->default(false);
            $table->boolean('is_minor')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes for fast class/branch-wise querying
            $table->index(['branch_key', 'exam_date']);
            $table->index('exam_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_datesheets');
    }
};
