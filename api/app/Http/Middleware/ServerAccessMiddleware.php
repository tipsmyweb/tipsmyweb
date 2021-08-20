<?php

namespace App\Http\Middleware;

use Closure;

class ServerAccessMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $ip_address = array_key_exists('HTTP_X_FORWARDED_FOR', $_SERVER) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : $request->ip();
        $authorized_ip_address = explode(',', config('auth.server_access.ips'));

        if(array_search($ip_address, $authorized_ip_address) !== false)
            return $next($request);

        \Log::info("403, Unauthorized Access Point");
        abort(403, "Unauthorized Access Point");
    }
}
