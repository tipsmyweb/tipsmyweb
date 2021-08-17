<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\StatResource;

class StatResourceJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $resource_id;
    protected $action;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($resource_id, $action)
    {
        $this->resource_id = $resource_id;
        $this->action = $action;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        StatResource::saveAction($this->resource_id, $this->action);
    }
}
