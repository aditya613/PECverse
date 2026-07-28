<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MessController extends Controller
{
    public function index()
    {
        $messes = \App\Models\Mess::orderBy('name')->get();
        return response()->json($messes);
    }

    public function menu(Request $request)
    {
        $request->validate([
            'mess_id' => 'required|exists:messes,id',
        ]);

        $menus = \App\Models\MessMenu::where('mess_id', $request->mess_id)
            ->orderBy('day_of_week')
            ->get();

        return response()->json($menus);
    }
}
