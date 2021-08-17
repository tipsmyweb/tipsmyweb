<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    
    public function __construct(){
        $this->env = config('app.env');
    }

    /**
     * This methods is intended to run test on development env
     * 
     */
    public function execute(Request $request)
    {
        if ($this->env == 'development') {
            # Run your local test here ...

            

        }

        return response()->json();

    }
}
