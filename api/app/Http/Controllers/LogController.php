<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Log;

class LogController extends Controller
{
    
    public function getLogs(Request $request)
    {
        // Date formate Y-m-d
        $date = $request->date;
        $logs = Log::where("created_date", $date)->with('route', 'geoip')
        ->paginate(config('app.pagination.default'));
        
        return response()->json($logs, 200);
    }
}
