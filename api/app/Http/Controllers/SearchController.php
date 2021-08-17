<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Resource;
use App\Tag;
use App\Price;
use App\Type;
use App\Suggestion;
use App\Contact;

class SearchController extends Controller
{
    /**
     * Display a listing of the resource found with the key.
     *
     * @return \Illuminate\Http\Response
     */
    public function adminGeneralSearch(Request $request)
    {
        // Retrieve key to launch search
        $key = $request->key;
        $sql_search_key = '%'.$key.'%';

        // Search for results in Resources
        $resources = Resource::select('id', 'name')
        ->where(
            'name', 'LIKE', $sql_search_key
        )

        ->orWhere(
            'url', 'LIKE', $sql_search_key
        )
        ->get();

        // Search for results in Tags
        $tags = Tag::select('id', 'name')
        ->where(
            'name', 'LIKE', $sql_search_key
        )
        ->orWhere(
            'slug', 'LIKE', $sql_search_key
        )
        ->get();

        // Search for results in Prices
        $prices = Price::select('id', 'name')
        ->where(
            'name', 'LIKE', $sql_search_key
        )
        ->orWhere(
            'slug', 'LIKE', $sql_search_key
        )
        ->get();

        // Search for results in Types
        $types = Type::select('id', 'name')
        ->where(
            'name', 'LIKE', $sql_search_key
        )
        ->get();

        $results = array(
            $this->formateAdminSearchResult('resources', 'Resources', $this->mapObjectResults($resources)),
            $this->formateAdminSearchResult('tags', 'Tags', $this->mapObjectResults($tags)),
            $this->formateAdminSearchResult('prices', 'Prices', $this->mapObjectResults($prices)),
            $this->formateAdminSearchResult('types', 'Types', $this->mapObjectResults($types)),
        );

        return response()->json($results, 200);
    }


    /**
     * Formate Result for GeneralAdminSeacrch
     * 
     */
    protected function formateAdminSearchResult($slug, $name, $results)
    {
        return array(
            'name'      =>  $name,
            'slug'      =>  $slug,
            'results'   =>  $results
        );
    }

    protected function mapObjectResults($results){
        return array_map(
            function($results){
                return array(
                    'id'    => $results['id'],
                    'title' => $results['name'],
                );
            },
            $results->toArray());
    }
}
