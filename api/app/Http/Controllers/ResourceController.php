<?php

namespace App\Http\Controllers;

use App\Services\ImportValidation\ResourceImportValidation;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Services\Cache\CacheManager;
use App\Resource;
use App\ResourceTag;
use App\Tag;
use App\Price;
use App\Type;
use App\Http\Requests\ResourceRequest;
use App\StatResource;

class ResourceController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $r = Resource::with('resource_tags', 'price', 'type')->get();
        return response()->json($r, 200);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ResourceRequest $request)
    {

        $r = new Resource();

        try {
            $resource = $r->create($request->all());
            // Save ResourceTag
            $resource->resource_tags()->createMany($request->tags);
        } catch(\Exception $e) {
            abort(500, "Can't save the resource");
        }
        return response()->json(Resource::find($resource->id), 201);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $r = Resource::where('id', $id)
            ->with('resource_tags', 'price', 'type')
            ->first();
        return response()->json($r, 200);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ResourceRequest $request, $id)
    {
        $r = Resource::findOrFail($id);

        // Update resource
        try {
            $r->update($request->all());
        } catch(\Exception $e) {
            abort(500, "Can't update the resource");
        }

        // Update resource tags
        try {
            $r->updateResourceTags($request->tags);
        } catch (\Exception $e) {
            abort(500, "Can't update the resource tags");
        }

        return response()->json($r, 200);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $r = Resource::findOrFail($id);

        try {
            $resource_tags = ResourceTag::where('resource_id', $r->id)->get();

            foreach ($resource_tags as $rt) {
                $rt->delete();
            }

            $r->delete();
        } catch(\Exception $e) {
            abort(500, "Can't delete the resource");
        }
        return response()->json();
    }


    /**
     * Import array of resource
     */
    public function importResources(Request $request){

        // Resources validation
        // Retrieve validated resources
        $resourceImportValidation = new ResourceImportValidation($request->data);
        $validatedResources = $resourceImportValidation->GetValidatedElements();

        CacheManager::cleanCache($withImage = true);
        
        foreach ($validatedResources as $resource) {

            $r = Resource::where('name', $resource['name'])->get()->first();

            if (!$r) {
                $r = new Resource();
            }

            // Create resource entity
            $r->name = $resource['name'];
            if(array_key_exists('description', $resource)){
                $r->description = $resource['description'];
            }
            $r->url = $resource['url'];
            $r->language = $resource['language'];
            if(array_key_exists('score', $resource)){
                $r->score = $resource['score'];
            }
            if(array_key_exists('interface', $resource)){
                $r->interface = $resource['interface'];
            }
            if(array_key_exists('renown', $resource)){
                $r->renown = $resource['renown'];
            }
            $r->price_id = $resource['price_id'];
            $r->type_id = $resource['type_id'];
            $r->save();

            // Create resource tags entity
            $r->updateResourceTags($resource['related_tags']);

            // Add image to resource
            $r->uploadImageFromUrlJobCreation($resource);
        }
        return response()->json(sizeof($validatedResources).' resources have been added or updated on '.
            $resourceImportValidation->GetNumberOfImportedElements().' imported.');
    }

    /**
     * Validation of imported resources
     * @param Request $request
     */
    public function validateImportedResources(Request $request)
    {
        $resourceImportValidation = new ResourceImportValidation($request->data);

        $validationErrors = $resourceImportValidation->GetElementsErrors();

        return response()->json($validationErrors);
    }


    /**
     * Upload an image
     */
    public function uploadImage(Request $request, $id) {

        // Retrieve Resource from id
        $resource = Resource::findOrFail($id);

        // Remove cache if exists
        CacheManager::removeResourceImageCache($id);

        $file = $request->file('file');
        return $resource->uploadImageFromFile($file);
  }

    public function getImage(Request $r, $id) {

        // Récupération de la ressource
        $resource = Resource::findOrFail($id);

        $resource_image = Cache::remember(
            CacheManager::getCachedObjectName('resources_images', $id),
            CacheManager::getCachedObjectExpiration('resources_images'),
            function () use ($resource) {
                return $resource->getImage();
            });
        
        return $resource_image;
    }


    public function addLike(Request $r, $id)
    {
        $resource = Resource::findOrFail($id);
        $resource->like += 1;
        $resource->save();
        StatResource::launchStatResourceJob($resource->id, 'like');
        return response()->json();
    }

    public function removeLike(Request $r, $id)
    {
        $resource = Resource::findOrFail($id);
        if ($resource->like > 0) {
            $resource->like -= 1;
        }
        $resource->save();
        return response()->json();
    }


    public function addVisit(Request $request, $id)
    {
        $resource = Resource::findOrFail($id);
        $resource->visits += 1;
        $resource->save();
        StatResource::launchStatResourceJob($resource->id, 'visit');
        return response()->json();
    }
}
