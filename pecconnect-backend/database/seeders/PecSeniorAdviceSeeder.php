<?php

namespace Database\Seeders;

use App\Models\SeniorAdvice;
use Illuminate\Database\Seeder;

class PecSeniorAdviceSeeder extends Seeder
{
    public function run(): void
    {
        $advices = [
            [
                'title' => 'The 75% Attendance Golden Rule',
                'category' => 'Attendance',
                'content' => 'Always maintain your attendance above 80% before mid-sems! That gives you a safety buffer for fest season (PECFEST) and late-semester project submissions without getting detained.',
                'author_name' => 'Aditya G.',
                'author_batch' => '4th Year, CSE',
                'likes_count' => 142,
            ],
            [
                'title' => 'How to Get Into Technical Societies in 1st Year',
                'category' => 'Societies',
                'content' => 'Societies don\'t expect you to be a master coder on Day 1. They look for genuine enthusiasm, willingness to learn, and team spirit. Show up to orientations, participate in inductions, and don\'t hesitate to ask questions!',
                'author_name' => 'Priyanshu V.',
                'author_batch' => '3rd Year, ECE',
                'likes_count' => 118,
            ],
            [
                'title' => 'Best Study & AC Spots on Campus',
                'category' => 'Campus Life',
                'content' => 'The 1st floor reading room in the Central Library and Computer Center (CC-3) have the fastest Wi-Fi and best air conditioning during hot summer afternoons. Grab a corner table early!',
                'author_name' => 'Mehak S.',
                'author_batch' => '4th Year, EE',
                'likes_count' => 96,
            ],
            [
                'title' => 'Mess Food Hacks & Late Night Hunger',
                'category' => 'Hostels',
                'content' => 'Keep a kettle and maggi packets in your room for 2 AM coding/study sessions. Aero Cafe and Student Center Amul booth are your go-to spots between back-to-back lectures.',
                'author_name' => 'Rohit G.',
                'author_batch' => '3rd Year, ME',
                'likes_count' => 84,
            ],
            [
                'title' => 'First Year CGPA is the Easiest to Maximize',
                'category' => 'Academics',
                'content' => '1st year subjects (Physics, Math, Basic Electrical, Programming) are largely extensions of 11th/12th concepts. Target 9+ CGPA in Sem 1 & 2—it sets a strong foundation for branch changes and placement cutoffs later!',
                'author_name' => 'Arpit B.',
                'author_batch' => '4th Year, CSE',
                'likes_count' => 156,
            ],
        ];

        foreach ($advices as $adviceData) {
            SeniorAdvice::updateOrCreate(['title' => $adviceData['title']], $adviceData);
        }
    }
}
