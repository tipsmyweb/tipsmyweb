<?php

namespace App\Services\Cache;

use Illuminate\Support\Facades\Cache;
use Exception;

class CacheManager
{

    /**
     * Get Cached Objects Expiration (in seconds)
     * 
     */
    public static function getCachedObjectExpiration(string $object_type)
    {
        switch ($object_type) {
        
            case 'public_tags_index':
                return CachedObjectExpiration::PUBLIC_TAGS_INDEX;
            
            case 'public_resources_research':
                return CachedObjectExpiration::PUBLIC_RESOURCES_RESEARCH;

            case 'resources_images':
                return CachedObjectExpiration::RESOURCES_IMAGE;

            default:
                throw new Exception("No Cached Object Expiration found", 1);
        }
    }    

    /**
     * Get Cached Objects Name
     * 
     */
    public static function getCachedObjectName(string $object_type, $object_id = null)
    {
        switch ($object_type) {
        
            case 'public_tags_index':
                return CachedObjectBaseName::PUBLIC_TAGS_INDEX;
            
            case 'public_resources_research':
                if ($object_id !== null) {
                    return CachedObjectBaseName::PUBLIC_RESOURCES_RESEARCH."_".$object_id;
                }
                throw new Exception("Cache Manager : No ObjectId provided");

            case 'resources_images':
                if ($object_id !== null) {
                    return CachedObjectBaseName::RESOURCES_IMAGE."_".$object_id;
                }
                throw new Exception("Cache Manager : No ObjectId provided");

            default:
                throw new Exception("No Cached Object Name found");            
        }
    }

    /**
     * Remove specific resource image cache
     * 
     */
    public static function removeResourceImageCache($resource_image_id)
    {
        $cached_key = CacheManager::getCachedObjectName('resources_images', $resource_image_id);

        if(Cache::has($cached_key))
        {
            Cache::forget($cached_key);
        }
    }

    /**
     * Clean cache
     * 
     */
    public static function cleanCache($withImage = false)
    {
        if($withImage){
            return Cache::flush();
        }

        // ToDO with MemCache, remove cached objects by Tag
        
        if (Cache::has('public_tags_index')) {
            Cache::forget('public_tags_index');
        }
    }
}