<?php

namespace App\Http\Controllers;

use App\LogRoute;
use Illuminate\Http\Request;
use App\Log;

class LogController extends Controller
{
    
    public function getLogs(Request $request)
    {
        // Date formate Y-m-d
        $date = $request->date;
        $order = $request->order;
        $search = $request->search;
        $sortDirection = $request->sort_direction;
        $sortAttribute = $request->sort_attribute;
        $filters = $request->filters ?? array(); // ToDO Add a custom Request to make filters mandatory

        $level_index = array_search('level', array_column($filters, 'attribute'));
        $level_filters = $level_index !== FALSE ? $filters[$level_index] : null;

        $route_index = array_search('route', array_column($filters, 'attribute'));
        $route_filters = $route_index !== FALSE ? $filters[$route_index] : null;

        $route_ids = null;
        if($route_filters){
            $route_ids = LogRoute::whereIn('uri', $route_filters['values'])
                ->get()
                ->pluck('id')
                ->toArray();
        }


        $sortedQuery = null;
        if ($sortDirection && $sortAttribute)
            $sortedQuery = array(
                'attribute' =>  $sortAttribute,
                'direction' =>  $sortDirection
            );

        $logs = Log::with('route', 'geoip')
            ->when($level_filters, function($query, $level_filters) {
                return $query->whereIn('level', $level_filters['values']);
            })
            ->when($route_ids, function($query, $route_ids) {
                return $query->whereIn('route_id', $route_ids);
            })
            ->when($search, function($query, $search) {
                return $query->where('description', 'LIKE', '%'.$search.'%');
            })
            ->where("created_date", $date)
            ->when($sortedQuery, function($query, $sortedQuery) {
                return $query->orderBy($sortedQuery['attribute'], $sortedQuery['direction']);
            }, function($query) {
                return $query->orderBy('created_at', 'DESC');
            })
            ->paginate(config('app.pagination.default'));

        return response()->json($logs, 200);
    }

    public function getLogFilters()
    {
        $log_levels = Log::select('level')
            ->distinct()
            ->get()
            ->pluck('level')
            ->toArray();
        $log_routes = LogRoute::select('uri')
            ->distinct()
            ->get()
            ->pluck('uri')
            ->toArray();

        $filters = array(
            array(
                'attribute' => 'level',
                'values'    => array_values($log_levels)
            ),
            array(
                'attribute' => 'route',
                'values'    => array_values($log_routes)
            )
        );

        return response()->json($filters, 200);
    }
}
