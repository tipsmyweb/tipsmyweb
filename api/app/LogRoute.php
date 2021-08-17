<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LogRoute extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'log_routes';


    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['uri', 'method', 'controller'];

    
}
