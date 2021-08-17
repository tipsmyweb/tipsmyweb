<?php

namespace App\Services\Files;

class ImageUtils
{

    /**
     * Search for image extension from url
     * 
     */
    public static function getImageExtensionFromUrl($url)
    {
        try{
            $headers = get_headers($url);
            foreach ($headers as $header) {
                if (strpos($header, 'Content-Type') !== false) {
                    $pos = strpos($header, 'image');
                    if ($pos !== false) {
                        $extension = substr($header, $pos + strlen('image') + 1);
                        $pos = strpos($extension, ';');
                        if ($pos !== false) {
                            $extension = substr($extension, 0, $pos - 1);
                        }
            
                        return $extension;
                    }
                }
            }
        } catch (\Throwable $th){}

        return null;
    }


    /**
     * Search for image extension from uploaded file
     * 
     */
    public static function getImageExtensionFromFile($file)
    {
        return $file->guessExtension();
    }

}
