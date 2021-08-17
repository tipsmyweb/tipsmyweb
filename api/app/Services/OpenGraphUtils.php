<?php

namespace App\Services;

use Illuminate\Support\Carbon;
use OpenGraph;

class OpenGraphUtils
{

    protected $open_graph_data = array();

    public function __construct($url)
    {
        $this->open_graph_data = OpenGraph::fetch($url);
    }

    public function getOpenGraph()
    {
        return $this->open_graph_data;
    }

    protected function getCustomField($field)
    {
        if (array_key_exists($field, $this->open_graph_data)) {
            return $this->open_graph_data[$field];
        }
        return null;
    }

    public function getImageUrl()
    {
        return $this->getCustomField('image');
    }

    public function getDescription()
    {
        return $this->getCustomField('description');
    }

    public function getType()
    {
        return $this->getCustomField('type');
    }

    public function getTitle()
    {
        return $this->getCustomField('title');
    }
    
}