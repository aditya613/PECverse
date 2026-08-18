<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Fresher;

class FresherAuthMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('X-Fresher-Token') ?? $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Unauthorized. Missing fresher token.'], 401);
        }

        $fresher = Fresher::where('secret_token', $token)->first();

        if (!$fresher) {
            return response()->json(['message' => 'Unauthorized. Invalid fresher token.'], 401);
        }

        // Attach the authenticated fresher object to the request
        $request->merge(['authenticated_fresher' => $fresher]);

        return $next($request);
    }
}
