<?php

namespace App;

use App\Services\Stats\SearchTagsStatsService;
use App\Services\Stats\StatsTagsService;
use Illuminate\Database\Eloquent\Model;
use App\Services\DateUtils;
use App\Jobs\Stats\StatTagJob;
use DB;

class StatTag extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'stat_tags';


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['tag_id', 'action', 'created_date'];


    /**
     * Define dates
     *
     * @var array
     */
    protected $dates = ['created_at', 'updated_at'];

    /**
     * The tag that belong to the resource_tag.
     */
    public function tag()
    {
        return $this->belongsTo('App\Tag');
    }


    /**
     * Action possibilities
     *
     */
    protected static $actions = [
        'search',
    ];


    /**
     * Launch Stat Resource Job
     *
     */
    public static function launchStatTagJob($tag_id, $action)
    {
        StatTagJob::dispatch($tag_id, $action);
    }


    /**
     * Method to save specific action on Resource
     *
     */
    public static function saveAction($tag_id, $action)
    {
        $tag = Tag::find($tag_id);

        if ($tag && array_search($action, StatTag::$actions) !== FALSE) {
            $s = new StatTag();
            $s->tag_id = $tag_id;
            $s->action = $action;
            $s->created_date = DateUtils::getCurrentDate();
            $s->save();
        }
    }


    /**
     * Get most recurrent tags based on specific action
     *
     */
    public static function getStatsTags($start_date, $end_date)
    {
        $raw_stats_tags = StatTag::with('tag')
            ->where([
                ['created_date', '>=', $start_date],
                ['created_date', '<=', $end_date]])
            ->get();

        $tags_relation_graph = Tag::loadMainTags();

        return StatsTagsService::CombineTagsStats($raw_stats_tags, $tags_relation_graph);
    }
}