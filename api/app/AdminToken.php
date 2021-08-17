<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AdminToken extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'admin_token';


    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['token', 'disabled'];
}
