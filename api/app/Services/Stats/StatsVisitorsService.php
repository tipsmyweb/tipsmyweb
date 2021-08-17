<?php

namespace App\Services\Stats;

use App\Services\DateUtils;

class StatsVisitorsService
{
    public static function CombineVisitorsStats($start_date, $end_date, $visitors_stats, $new_visitors_stats)
    {
        $visitors_tags_structure = DateUtils::getCustomDataRange($start_date, $end_date, self::GetBaseStructureVisitorStat());

        foreach ($new_visitors_stats as $new_visitor_stat)
        {
            $visitors_tags_structure[$new_visitor_stat->created_date]['new_visitors_count'] += 1;
        }

        foreach ($visitors_stats as $visitor_stat)
        {
            $visitors_tags_structure[$visitor_stat->created_date]['visitors_count'] = $visitor_stat->count;
        }

        return array_values($visitors_tags_structure);
    }

    public static function GetBaseStructureVisitorStat()
    {
        return array(
            'visitors_count' => 0,
            'new_visitors_count' => 0
        );
    }
}