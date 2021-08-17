<?php

namespace App\Jobs\Availability;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Resource;
use App\Services\MailSender;

class WebsiteAvailability implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $resources;
    protected $unavailable_resources;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->resources = Resource::all();
        $this->unavailable_resources = array();
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        foreach ($this->resources as $resource) {
            $this->checkWebsiteAvailability($resource);
        }

        $this->sendEmailAlert();
    }

    /**
     * Check if the resource website is available
     * 
     */
    protected function checkWebsiteAvailability(Resource $resource)
    {
        try {
            $ch = curl_init();

            $options = array(
                CURLOPT_URL            => $resource->url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HEADER         => true,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_ENCODING       => "",
                CURLOPT_AUTOREFERER    => true,
                CURLOPT_CONNECTTIMEOUT => 120,
                CURLOPT_TIMEOUT        => 120,
                CURLOPT_MAXREDIRS      => 10,
            );
            curl_setopt_array($ch, $options);
            curl_exec($ch);
            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            if (($http_code != "200") && ($http_code != "302")) {
                array_push(
                    $this->unavailable_resources,
                    array(
                        'resource'  => $resource,
                        'http_code' => $http_code 
                    ));
            }
        } catch (\Throwable $th) {
            array_push(
                $this->unavailable_resources,
                array(
                    'resource'  => $resource,
                    'http_code' => 'Job Exception' 
                ));
        }
        
    }

    /**
     * Send email alert if needed
     * 
     */
    protected function sendEmailAlert()
    {
        if (count($this->unavailable_resources) > 0) {
            MailSender::send_resource_websites_availability_alert($this->unavailable_resources);
        }
    }
}
