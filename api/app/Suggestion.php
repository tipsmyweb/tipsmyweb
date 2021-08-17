<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuids;

class Suggestion extends Model
{
    use Uuids;


    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'suggestions';


    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['url', 'description'];


    /**
     * Define dates
     *
     * @var array
     */
    protected $dates = ['created_at', 'updated_at'];


    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

}
