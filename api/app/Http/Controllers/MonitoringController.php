<?php

namespace App\Http\Controllers;

use App\Resource;
use App\Services\MailSender;
use Illuminate\Http\Request;

class MonitoringController extends Controller
{
    public function getResourcesUrls()
    {
        $resources = Resource::getResourcesUrls();

        return response()
            ->json($resources, 200)
            ->setEncodingOptions(JSON_UNESCAPED_SLASHES);
    }

    public function resourcesUrlMonitoringJobFailed()
    {
        MailSender::sendJobFailedEmail('Resources URL Availability Monitoring');
    }

    public function sendResourcesUrlsAvailabilityResults(Request $request)
    {
        $results = $request->results;

        MailSender::sendJUrlsAvailabilityResultsEmail($results);
    }
}
