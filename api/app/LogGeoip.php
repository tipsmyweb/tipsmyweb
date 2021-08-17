<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LogGeoip extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'log_geoips';


    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['continent', 'timezone', 'country', 'state_name', 'city'];

}
