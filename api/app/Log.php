<?php

namespace App;

use App\Services\Stats\StatsVisitorsService;
use Illuminate\Database\Eloquent\Model;
use DB;

class Log extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'logs';


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['description', 'level', 'created_date', 'hashed_ip', 'route_id', 'geoip_id', 'token_id', 'parameters'];


    /**
     * Attributes to hide
     */
    protected $hidden = ['hashed_ip', 'geoip_id', 'token_id', 'route_id'];


    /**
     * Route relationship
     */
    public function route(){
        return $this->belongsTo('App\LogRoute');
    }


    /**
     * Route relationship
     */
    public function geoip(){
        return $this->belongsTo('App\LogGeoip');
    }

    public static function getStatsVisitors($start_date, $end_date)
    {
        $new_visitors = DB::table('logs')
            ->groupBy('hashed_ip')
            ->select('created_date')
            ->havingRaw('min(created_date) >= \''.$start_date.'\' and min(created_date) <= \''.$end_date.'\'')
            ->get();

        $visitors = DB::table('logs')
            ->where([
                ['created_date', '>=', $start_date],
                ['created_date', '<=', $end_date]])
            ->select('created_date', DB::raw('count(distinct(hashed_ip)) as count'))
            ->groupBy('created_date')
            ->get();

        return StatsVisitorsService::CombineVisitorsStats($start_date, $end_date, $visitors, $new_visitors);
    }

}
