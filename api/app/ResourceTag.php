<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class ResourceTag extends Model
{


    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'resource_tags';


    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['resource_id', 'tag_id', 'belonging'];


    /**
     * Define dates
     *
     * @var array
     */
    protected $dates = ['created_at', 'updated_at', 'deleted_at'];


    // protected $appends = ['tag', 'resource'];


    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;


    /**
     * The resource that belong to the resource_tag.
     */
    public function resource()
    {
        return $this->belongsTo('App\Resource');
    }


    /**
     * The tag that belong to the resource_tag.
     */
    public function tag()
    {
        return $this->belongsTo('App\Tag');
    }

    protected $appends = ['tag'];


    /**
     * Function for attribute Tag
     */
    public function getTagAttribute(){
        $tags = $this->tag()->get();
        if ($tags) {
            return $tags->first();
        }
    }


    /**
     * Function for attribute Resource
     */
    public function getResourceAttribute(){
        $resources = $this->resource()->get();
        if ($resources) {
            return $resources->first();
        }

    }

    /**
    * Rules pour Validator
    *
    * @var array
    */
    public static $rules = [
        'resource_id'           =>      'required|exists:resources,id',
        'tag_id'                =>      'required|exists:tags,id',
        'belonging'             =>      'required|integer|min:0|max:0'
    ];


    /**
     * Scoring weight values
     * 
     */
    protected static $finalScoringWeight = array(
        'score'         =>  10,
        'belonging'     =>  8,
        'public'        =>  7,
        'price'         =>  6,
        'interface'     =>  3,
    );

    /**
     * Compute final score with scoring weight
     * 
     */
    protected static function computeFinalScore($resource_score, $belonging_score, $public_score,
        $price_score, $interface_score)
    {
        $scoringWeight = ResourceTag::$finalScoringWeight;
        $factor = array_sum($scoringWeight);

        return round(((
            $resource_score * $scoringWeight['score'] +
            $belonging_score * $scoringWeight['belonging'] +
            $public_score * $scoringWeight["public"] +
            $price_score * $scoringWeight["price"] +
            $interface_score * $scoringWeight["interface"]
        ) / $factor) * 10, 2);
    }


    /**
     * Scoring price values
     * 
     */
    protected static $scoringPrice = array(
        'free'              =>  10,
        'freemium'          =>  8,
        'cost_1'            =>  6,
        'cost_2'            =>  4,
        'cost_3'            =>  2,
        'purchase_1'        =>  5,
        'free_freemium'     =>  9,
        'free_cost_1'       =>  7,
        'free_cost_2'       =>  5,
        'free_const_3'      =>  3,
        'free_purchase_1'   =>  6,
    );

    /**
     * Compute Price Score
     * 
     */
    protected static function computePriceScore($price)
    {
        if (!array_key_exists($price, ResourceTag::$scoringPrice)) {
            return 0;
        }

        return ResourceTag::$scoringPrice[$price];
    }


    /**
     * Scoring interface values
     * 
     */
    protected static $scoringInterface = array(
        1   =>  4,
        2   =>  7,
        3   =>  10,
    );

    /**
     * Compute Interface Score
     * 
     */
    protected static function computeInterfaceScore($interface)
    {
        if (!$interface) {
            return 0;
        }

        return ResourceTag::$scoringInterface[$interface];
    }


    /**
     * Like and Score Factors in Public Score
     * 
     */
    protected static $like_score_factor = 0.5;
    protected static $visit_score_factor = 0.5;

    /**
     * Compute Like Score
     * 
     */
    protected static function computePublicScore($like, $visits, $total_likes, $total_visits)
    {
        $like_score = 0;
        if ($total_likes)
            $like_score = $like / $total_likes;
        
        $visit_score = 0;
        if ($total_visits)
            $visit_score = $visits / $total_visits;
    
        return (
            $like_score * ResourceTag::$like_score_factor + 
            $visit_score * ResourceTag::$visit_score_factor);
    }


    /**
     * Compute Tags Belonging Score
     * 
     */
    protected static function computeBelongingScore($resource_tags_dict, $main_tag_id, $related_tag_ids)
    {
        // Main tags
        $belonging_score = $resource_tags_dict[$main_tag_id] * 2;
        $tag_ids_weight = 2;

        // Related tag 
        unset($resource_tags_dict[$main_tag_id]);
        $matched_ids = array_intersect(array_keys($resource_tags_dict), $related_tag_ids);
        $unmatched_ids_from_research = array_diff(array_keys($resource_tags_dict), $related_tag_ids);        

        $tag_ids_weight += (sizeof($matched_ids) + sizeof($unmatched_ids_from_research) * 0.5);
        foreach ($matched_ids as $match_id) {
            $belonging_score += $resource_tags_dict[$match_id];
        }

        return $belonging_score / $tag_ids_weight;
    }


    /**
     * Compute resources recommendation
     * 
     */
    public static function getRecommendedResources($resources, $main_tag_id, $related_tag_ids)
    {
        $total_likes = 0;
        $total_visits = 0;

        // Count number of likes, visit
        // Create data strcture for resouce tags
        foreach ($resources as &$resource) {

                $resource_tags_dict = array();
                foreach ($resource['resource_tags'] as $rt) {
                    $resource_tags_dict[$rt['tag_id']] = $rt['belonging'];
                }
                $resource['resource_tags_dict'] = $resource_tags_dict;
                
                $total_likes += $resource['like'];
                $total_visits += $resource['visits'];

            }

        // Compute scoring 
        foreach ($resources as &$resource) {
            
            $resource_score = $resource["score"];
            $belonging_score = ResourceTag::computeBelongingScore($resource['resource_tags_dict'], $main_tag_id, $related_tag_ids);
            $public_score = ResourceTag::computePublicScore($resource['like'], $resource['visits'], $total_likes, $total_visits);
            $price_score = ResourceTag::computePriceScore($resource['price']['slug']);
            $interface_score = ResourceTag::computeInterfaceScore($resource['interface']);

            $resource['final_score'] = ResourceTag::computeFinalScore($resource_score, $belonging_score, $public_score,
                $price_score, $interface_score);

        }

        // Order resources by final score (descending)
        usort($resources ,function($first,$second){
            return $first['final_score'] < $second['final_score'];
        });

        // Remove useless attributes
        foreach ($resources as &$resource) {
            unset($resource['like']);
            unset($resource['score']);
            unset($resource['price_slug']);
            unset($resource['interface']);
            unset($resource['renown']);
            unset($resource['belonging']);
            unset($resource['resource_tags']);
            unset($resource['resource_tags_dict']);
            unset($resource["final_score"]);
        }

        return array_slice($resources, 0, 20);
    }
}
