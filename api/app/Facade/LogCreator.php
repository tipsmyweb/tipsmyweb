<?php


namespace App\Facade;

use Illuminate\Support\Facades\Facade;

class LogCreator extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'LogCreator';
    }
}