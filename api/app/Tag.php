<?php

namespace App;

use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Uuids;

class Tag extends Model
{
    use SoftDeletes;
    use Uuids;
    use HasSlug;


    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tags';


    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['name', 'primary'];


    /**
     * Define dates
     *
     * @var array
     */
    protected $dates = ['created_at', 'updated_at', 'deleted_at'];


    /**
     * Define hidden attributes
     * 
     * @var array
     */
    protected $hidden = ['resource_tags_count'];


    /**
     * Define threshold tags
     * need to appear in ResourceTag
     * 
     * @var int
     */
    protected static $threshold_resource_tags_count = 3;
    


    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug')
            ->usingSeparator('-')
            ->doNotGenerateSlugsOnUpdate() // To guarantee that shareable URLs won't change
            ->slugsShouldBeNoLongerThan(50);
    }


    /**
     * Function to check if tag may be in main app
     * Tag may be disabled
     * Tag may have too few linked Resources
     * 
     */
    public function isMainTagPublic()
    {
        if ($this->disabled) {
            return false;
        }

        if (config('app.env') != 'production') {
            return true;
        }

        if ($this->resource_tags_count && $this->resource_tags_count > Tag::$threshold_resource_tags_count) {
            return true;
        }
        
        return false;
    }


    /**
     * Function that check if related tag may
     * be in main app
     * 
     */
    public static function isRelatedTagPublic($related_tag_weight)
    {
        if (config('app.env') != 'production') {
            return true;
        }

        if ($related_tag_weight >= Tag::$threshold_resource_tags_count) {
            return true;
        }

        return false;
    }


    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;


    /**
     * The resource_tags that belong to the tag.
     */
    public function resource_tags()
    {
        return $this->hasMany('App\ResourceTag');
    }


    /**
     * Disable a tag
     */
    public function disableTag(){
        $this->disabled = true;
        $this->save();
    }


    /**
     * Enable a tag
     */
    public function enableTag(){
        $this->disabled = false;
        $this->save();
    }


    /**
     * Tag is primary
     */
    public function setTagIsPrimary(){
        $this->primary = true;
        $this->save();
    }


    /**
     * Tag is not primary
     */
    public function setTagIsSecondary(){
        $this->primary = false;
        $this->save();
    }


    /**
     * Function to load main tags for public
     */
    public static function loadMainTags()
    {

        $main_tags = array();
        $tags = Tag::with('resource_tags')
            ->withCount('resource_tags')
            ->get();

        $reconstructed_resources = array();

        foreach ($tags as $tag) {

            if (!$tag->isMainTagPublic()) {
                continue;
            }

            // Create new tag keys
            if (!array_key_exists($tag->id, $main_tags)) {
                $main_tags[$tag->id] = array(
                    'id'        =>  $tag->id,
                    'name'      =>  $tag->name,
                    'slug'      =>  $tag->slug,
                    'primary'   =>  $tag->primary,
                    'weight'    =>  $tag->resource_tags_count,
                    'related_tags'   =>  array(),
                );
            }

            // Reconstruct resources with resources_tags attribute
            foreach ($tag->resource_tags as $rt){
                if (array_key_exists($rt->resource_id, $reconstructed_resources)) {
                    array_push($reconstructed_resources[$rt->resource_id], $rt->tag_id);
                } else {
                    $reconstructed_resources[$rt->resource_id] = [$rt->tag_id];
                }
            }
        }

        // Insert into each primary tag related tags
        foreach (array_keys($reconstructed_resources) as $resource_id){
            foreach($reconstructed_resources[$resource_id] as $tag_id_key){
                foreach($reconstructed_resources[$resource_id] as $tag_id_related){
                    if ($tag_id_key !== $tag_id_related 
                        && array_key_exists($tag_id_related, $main_tags) 
                        && array_key_exists($tag_id_key, $main_tags)) {
                        
                        if (array_key_exists($tag_id_related, $main_tags[$tag_id_key]['related_tags'])) {
                            $main_tags[$tag_id_key]['related_tags'][$tag_id_related]['weight'] += 1;
                        } else {
                            $main_tags[$tag_id_key]['related_tags'][$tag_id_related] = array(
                                'id'        =>  $tag_id_related,
                                'name'      =>  $main_tags[$tag_id_related]['name'],
                                'slug'      =>  $main_tags[$tag_id_related]['slug'],
                                'weight'    =>  1,
                            );
                        }
                    }
                }
            }
        }

        // Only takes values from related_tags array
        foreach ($main_tags as &$tag) {
            foreach ($tag['related_tags'] as $related_tag_id => $related_tag) {
                if(!Tag::isRelatedTagPublic($related_tag['weight'])) {
                    unset($tag['related_tags'][$related_tag_id]);
                }
            }
            $tag['related_tags'] = array_values($tag['related_tags']);
        }
        
        return array_values($main_tags);
    }
}
