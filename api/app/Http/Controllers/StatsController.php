<?php

namespace App\Http\Controllers;

use App\Log;
use Illuminate\Http\Request;
use App\Resource;
use App\Services\DateUtils;
use DB;
use App\StatTag;
use App\StatResource;

class StatsController extends Controller
{

    #region Tags
    public function getStatsTags(Request $request)
    {
        // Date formate Y-m-d
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $search_tag_count = StatTag::getStatsTags($start_date, $end_date);

        return response()->json($search_tag_count, 200);
    }

    #endregion

    #region Resources
    public function getTopTrendyResources(Request $request)
    {
        // Date formate Y-m-d
        $start_date = $request->start_date;
        $end_date = $request->end_date;
        $quantity = 10;
        if ($request->get('quantity')) {
            $quantity = $request->get('quantity');
        }

        $trendy_resources = array(
            'like' => StatResource::getMostRecurrentResourcesByAction($start_date, $end_date, 'like', $quantity),
            'visit' => StatResource::getMostRecurrentResourcesByAction($start_date, $end_date, 'visit', $quantity)
        );

        return response()->json($trendy_resources, 200);
    }


    public function getTopAllTimeResources(Request $request)
    {
        $quantity = 10;
        if ($request->get('quantity')) {
            $quantity = $request->get('quantity');
        }
        $top_resources_all_time = array();

        $top_resources_all_time["visits"] = Resource::orderBy('visits', 'DESC')
            ->take($quantity)
            ->get();

        $top_resources_all_time["like"] = Resource::orderBy('like', 'DESC')
            ->take($quantity)
            ->get();

        return response()->json($top_resources_all_time, 200);
    }
    #endregion


    #region Visitors

    public function getStatsVisitors(Request $request)
    {
        // Date formate Y-m-d
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $stats_visitors = Log::getStatsVisitors($start_date, $end_date);

        return response()->json($stats_visitors, 200);
    }

    public function getStatsVisitorsCurrentDay()
    {
        $current_date = DateUtils::getCurrentDate();
        $start_date = $current_date;
        $end_date = $current_date;

        $stats_visitors = Log::getStatsVisitors($start_date, $end_date);

        if (sizeof($stats_visitors) == 0)
            $stats_visitors = array(
                'date' => $current_date,
                'visitors_count' => 0,
                'new_visitors_count' => 0
            );

        return response()->json($stats_visitors[0], 200);
    }
    #endregion
}
