<?php

namespace App\Services\Logs;

use App\Log;
use Monolog\Logger;
use Monolog\Handler\AbstractProcessingHandler;

class LogHandler extends AbstractProcessingHandler
{
    public function __construct($level = Logger::DEBUG)
    {
        parent::__construct($level);
    }

    protected function write(array $record)
    {
       $log = new Log();
       $log->fill($record['formatted']);
       $log->save();
    }

    /**
    * {@inheritDoc}
    */
    protected function getDefaultFormatter()
    {
       return new LogFormatter();
    }


    
}