<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuids;
use App\ResourceTag;
use App\Tag;
use App\Jobs\ImportImage;
use App\Services\OpenGraphUtils;
use App\Services\Files\ImageUtils;
use App\Services\Files\ImageStorage;

class Resource extends Model
{

    use Uuids;


    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'resources';


    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['name', 'description', 'url', 'image', 'language',
        'score', 'renown', 'price_id', 'type_id', 'interface', 'like'];


    /**
     * Define dates
     *
     * @var array
     */
    protected $dates = ['created_at', 'updated_at', 'deleted_at'];


    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;


    /**
     * The price relationship
     */
    public function price(){
        return $this->belongsTo('App\Price');
    }


    /**
     * The price relationship
     */
    public function type(){
        return $this->belongsTo('App\Type');
    }


    /**
     * The resource_tags that belong to the resource.
     */
    public function resource_tags()
    {
        return $this->hasMany(ResourceTag::class);
    }


    public function getTagsAttribute()
    {
        $all_tags = Tag::all()->toArray();
        $tags = [];
        foreach ($this->resource_tags as $resource_tag) {
            $tag_id = $resource_tag->tag_id;
            $tag = array_filter(
                $all_tags,
                function ($t) use (&$tag_id) {
                    return $t['id'] == $tag_id;
                }
            );
            if (array_key_exists(0, $tag)) {
                array_push($tags, $tag[0]);
            }

        }
        return $tags;
    }


    /**
     * Update resource tags of a resource
     * Remove, update or create resource tags
     * depending on existing one and tags provided
     */
    public function updateResourceTags($tags){

        $old_resource_tags = ResourceTag::where('resource_id', $this->id)->get();
        $new_resource_tags = $tags;
        foreach ($old_resource_tags  as $rt) {
            $index = array_search($rt->tag_id, array_column($new_resource_tags, 'tag_id'));
            if ($index === FALSE) {
                $rt->delete();
            } else {
                $rt->update($new_resource_tags[$index]);
            }
        }
        foreach ($new_resource_tags as $rt) {
            $index = array_search($rt['tag_id'], array_column($old_resource_tags->toArray(), 'tag_id'));

            if ($index === FALSE) {
                $new_rt = new ResourceTag();
                $new_rt->tag_id = $rt['tag_id'];
                $new_rt->resource_id = $this->id;
                $new_rt->belonging = $rt['belonging'];
                $new_rt->save();
            }
        }        
    }
    

    /**
    *   Update image attribute and store file
    *
    */
    public function setImage($file = null, $fileName = null, $binary=false){

        $this->image = $fileName;
        $this->save();

        if ($fileName !== null && $file !== null) {
            if ($binary) {
                return ImageStorage::storeBinaryImage($file, $fileName);
            }
            return ImageStorage::storeImage($file, $fileName);
        }
    }


    /**
    *   Retrieve image file
    *
    */
    public function getImage(){
        try {
            return ImageStorage::getImage($this->image);
        } catch(Exception $e){
            abort(500, 'Can\'t find or load the image');
        }
    }


    /**
    *  Remove image file and attribute in database
    *
    */
    public function deleteImage(){
        if ($this->image) {
            ImageStorage::deleteImage($this->image);
            $this->setImage();
        }
    }


    /**
     *  Upload file into storage 
     * 
     */
    protected function uploadImage($file, $fileName, $binary=false)
    {
        // Remove older image
        $this->deleteImage();
        // Add image file in storage and in database
        $this->setImage($file, $fileName, $binary);   
    }


    /**
    *  Upload Image from UploadedFile
    *
    */
    public function uploadImageFromFile($file){
        if (isset($file)) {            
            try {
                $fileExtension = ImageUtils::getImageExtensionFromFile($file);
                $fileName = $this->id.".".$fileExtension;
                $this->uploadImage($file->get(), $fileName);
            } catch(\Exception $e) {
                abort(500, 'Can\'t save the file');
            }
            
            return response()->json();
        }
        abort(404, 'Image not found');
    }


    /**
     * Create job to upload image 
     * 
     */
    public function uploadImageFromUrlJobCreation($provided_resource)
    {
        ImportImage::dispatch($provided_resource, $this);
    }


    /**
     * Upload image from url after importing resource
     * 
     */
    public function uploadImageFromUrl($provided_resource)
    {
        $file = null;

        // Image attribute is a link of image
        if (array_key_exists('image', $provided_resource) && $provided_resource['image']) {
            try {
                $extension = ImageUtils::getImageExtensionFromUrl($provided_resource['image']);
                if ($extension) {
                    $file = file_get_contents($provided_resource['image']);
                    $fileName = $this->id.".".$extension;
                }
            } catch (\Throwable $th){}

        } 

        // Search in website source code
        if (!$file && array_key_exists('url', $provided_resource) && $provided_resource['url'])
        {
            try {
                // Retrieve image
                $og = new OpenGraphUtils($provided_resource['url']);
                $image_url = $og->getImageUrl();
                if ($image_url) {
                    $extension = ImageUtils::getImageExtensionFromUrl($image_url);
                    if ($extension) {
                        $fileName = $this->id.".".$extension;
                        $file = file_get_contents($image_url);
                    }
                }
            } catch (\Throwable $th) {}
        }

        if ($file) {
            try {
                $this->uploadImage($file, $fileName, true);
            } catch (\Throwable $th) {}
        }
    }    
}
