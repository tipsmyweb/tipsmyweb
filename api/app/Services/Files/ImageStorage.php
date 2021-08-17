<?php

namespace App\Services\Files;

use Storage;
use Response;
use Image;

class ImageStorage
{

    protected static $STORAGE_PATH = 'public/resources/';

    protected static $MAX_WIDTH = 1280;
    protected static $MAX_HEIGHT = 720;

    /**
     * Public accessors
     * 
     */

    public static function getImageStorageDisk()
    {
        return config('filesystems.disks.storage.resource.image');
    }


    /**
     * Get image from storage
     * 
     */
    public static function getImage($fileName)
    {
        $image_path = ImageStorage::$STORAGE_PATH.$fileName;
        $file = Storage::disk(ImageStorage::getImageStorageDisk())->get($image_path);
        $type = Storage::disk(ImageStorage::getImageStorageDisk())->mimeType($image_path);
        $response = Response::make($file, 200);
        $response->header('Content-Type', $type);

        return $response;
    }


    /**
     * Store image in storage
     * 
     */
    public static function storeImage($file, $fileName)
    {
        $img = Image::make($file);
        $img->resize(ImageStorage::$MAX_WIDTH, ImageStorage::$MAX_HEIGHT, function ($constraint) {
            $constraint->aspectRatio();
        });
        $img->stream();
        
        Storage::disk(ImageStorage::getImageStorageDisk())->put(ImageStorage::$STORAGE_PATH.$fileName, $img);
    }

    /**
     * Store image in storage from binary
     * 
     */
    public static function storeBinaryImage($binaryFile, $fileName)
    {
        $file = @imagecreatefromstring($binaryFile);
        ImageStorage::storeImage($file, $fileName);
    }


    /**
     * Delete image from storage
     * 
     */
    public static function deleteImage($fileName)
    {
        $image_path = ImageStorage::$STORAGE_PATH.$fileName;
        Storage::disk(ImageStorage::getImageStorageDisk())->delete($image_path);
    }

}
