<?php

namespace App\Jobs\Stats;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\StatTag;

class StatTagJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $tag_id;
    protected $action;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($tag_id, $action)
    {
        $this->tag_id = $tag_id;
        $this->action = $action;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        StatTag::saveAction($this->tag_id, $this->action);
    }
}
