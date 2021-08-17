<?php

namespace App\Services\Cache;

abstract class CachedObjectExpiration
{
    // Expiration Time in Second

    const PUBLIC_TAGS_INDEX = 60 * 60 * 24; // 1 day
    const PUBLIC_RESOURCES_RESEARCH = 60 * 60 * 24; // 1 day
    const RESOURCES_IMAGE = 60 * 60 * 24 * 30; // 1 month

}