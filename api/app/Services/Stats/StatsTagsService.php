<?php

namespace App\Services\Stats;

use Illuminate\Database\Eloquent\Collection;

class StatsTagsService
{

    public static function CombineTagsStats(Collection $raw_stats_tags, $tags_relation_graph)
    {
        // Structure Raw Stats Tags Data
        $stats_tags_structure = array();
        foreach ($raw_stats_tags as $stat_tag)
        {
            if (!array_key_exists($stat_tag->tag_id, $stats_tags_structure))
                $stats_tags_structure[$stat_tag->tag_id] = self::getStatsBaseStructure();

            if (!array_key_exists($stat_tag->created_date, $stats_tags_structure[$stat_tag->tag_id]['detailed_count']))
                $stats_tags_structure[$stat_tag->tag_id]['detailed_count'][$stat_tag->created_date] = array(
                    'count' => 0,
                    'date' => $stat_tag->created_date
                );

            $stats_tags_structure[$stat_tag->tag_id]['detailed_count'][$stat_tag->created_date]['count'] += 1;
            $stats_tags_structure[$stat_tag->tag_id]['total_count'] += 1;
        }
        foreach ($stats_tags_structure as &$stat_tag_structure)
        {
            $stat_tag_structure['detailed_count'] = array_values($stat_tag_structure['detailed_count']);
        }

        // Add Stats Structure to Tags Relation Graph
        foreach ($tags_relation_graph as &$tag)
        {
            $tag['stats'] = self::getStatsStructureFromStatTags($stats_tags_structure, $tag['id']);

            foreach ($tag['related_tags'] as &$related_tag)
            {
                $related_tag['stats'] = self::getStatsStructureFromStatTags($stats_tags_structure, $related_tag['id']);
            }
        }

        return $tags_relation_graph;
    }

    protected static function getStatsStructureFromStatTags($tags_stats_structure, $tag_id): array
    {
        if (!array_key_exists($tag_id, $tags_stats_structure))
            return self::getStatsBaseStructure();

        return $tags_stats_structure[$tag_id];
    }

    protected static function getStatsBaseStructure(): array
    {
        return array(
            'total_count' => 0,
            'detailed_count' => array()
        );
    }


}