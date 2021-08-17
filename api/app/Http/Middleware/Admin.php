<?php

namespace App\Http\Middleware;

use App\AdminToken;
use Closure;
use App\Log;
use \Illuminate\Http\Request;

class Admin
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if($request->header("Authorization"))
        {

            $token = $request->header("Authorization");
            $log = AdminToken::where('token', $token)->get();
            if($log->first()) {
                $log = $log->first();
                $validity_hours = config('auth.admin.validity_hours');
                if((time() - $log->created_at->timestamp < $validity_hours*60*60) && !$log->disabled) {
                    return $next($request);
                } else {
                    \Log::info("401, unauthorized, token expired");
                    abort(401, "expired_token");
                    // return response()->json(array("error" => "token expired"));
                }
            }
            else {
                \Log::info("401, unauthorized, token not recognized");
                abort(401, "unknown_token");
                // return response()->json(array("error" => "token not recognized"));
            }
        }
        else {
            \Log::info("401, unauthorized, token not provided");
            abort(401, "undefined_token");
            // return response()->json(array("error" => "token not provided"));
        }
    }
}
