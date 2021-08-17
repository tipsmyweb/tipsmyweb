<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Facade\LogCreator as FacadeLogCreator;
use Exception;


class ProcessLog implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $message;
    protected $level;
    protected $context;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($message, $level, $context)
    {
        $this->message = $message;
        $this->level = $level;
        $this->context = $context;

    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        FacadeLogCreator::create($this->message, $this->level, $this->context);
    }

    public function failed(Exception $exception)
    {
        // Send user notification of failure, etc...
    }
}
