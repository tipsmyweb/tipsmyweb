<?php

namespace App\Http\Controllers;

use App\Resource;

class MonitoringController extends Controller
{
    public function getResourcesUrls()
    {
        $resources = Resource::getResourcesUrls();

        return response()
            ->json($resources, 200)
            ->setEncodingOptions(JSON_UNESCAPED_SLASHES);
    }
