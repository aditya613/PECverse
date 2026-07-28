<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// Run the class reminders check every minute
Schedule::command('app:send-class-reminders')
    ->everyMinute()
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/reminders.log'));

