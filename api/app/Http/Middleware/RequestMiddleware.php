<?php

namespace App\Http\Middleware;

use Closure;
use \Illuminate\Http\Request;
use LogCreator;
use App\Jobs\ProcessLog;

class RequestMiddleware
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

        $token = $request->header("Authorization");

        $response = $next($request);

        ProcessLog::dispatch("Request on ".$request->path(), "info", LogCreator::serializeLog($request));

        return $response;

    }

}