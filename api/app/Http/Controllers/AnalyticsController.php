<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function proxyQuery(Request $request, $route)
    {
        $client = new Client();
        $gaRequest = config('analytics.proxy_url').$route;
        $gaResponse = $client->request('GET',$gaRequest);

        return $gaResponse->getBody();
    }
}
