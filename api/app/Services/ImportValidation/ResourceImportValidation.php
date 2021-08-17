<?php

namespace App\Services\ImportValidation;

use App\Http\Requests\ResourceRequest;
use App\Price;
use App\Resource;
use App\Tag;
use App\Type;
use Illuminate\Support\Facades\Validator;

class ResourceImportValidation extends ImportValidationBase
{

    protected $pricesMappingDictionary;
    protected $typesMappingDictionary;
    protected $tagsMappingDictionary;
    protected $resourcesMappingDictionary;

    protected function InitializeValidation()
    {
        $this->pricesMappingDictionary = Price::all()->mapToDictionary(function($item) {
            return [strtolower($item['name']) => $item['id']];
        })->toArray();
        $this->typesMappingDictionary = Type::all()->mapToDictionary(function($item) {
            return [strtolower($item['name']) => $item['id']];
        })->toArray();
        $this->tagsMappingDictionary = Tag::withTrashed()->get()->mapToDictionary(function($item) {
            return [strtolower($item['name']) => $item['id']];
        })->toArray();
        $this->resourcesMappingDictionary = Resource::all()->mapToDictionary(function($item) {
            return [strtolower($item['url']) => $item['name']];
        })->toArray();
    }

    protected function ValidateElement(array $element, int $index)
    {
        $validation = Validator::make($element, (ResourceRequest::importRules()));

        // Check Resource attributes
        if ($validation->fails())
        {
            $this->setElementErrorMessages($validation->errors()->messages(), $index);
            return;
        }

        // Check Tags Format
        // Right format should be tag_name|tag_belonging, ...
        $related_tags = array();
        if(!array_key_exists('tag', $element)){
            $this->setElementErrorMessage($index, 'tags', 'No related tags ...');
        } else {
            foreach (explode(",", $element['tag']) as $resource_tag) {
                $args = explode("|", trim($resource_tag, " "));
                if (sizeof($args) != 2){
                    $this->setElementErrorMessage($index, 'tags',
                        'Wrong format. It should be `tag_name`|`tag_belonging`, ...');
                    return;
                }
                $tag_name = strtolower(trim($args[0]," "));
                $tag_score = trim($args[1], " ");

                if (!array_key_exists($tag_name, $this->tagsMappingDictionary)){
                    $this->setElementErrorMessage($index, 'tags',
                        'Tag '.$tag_name.' does not exist');
                    return;
                }

                $related_tag = array(
                    "tag_id" => $this->tagsMappingDictionary[$tag_name][0],
                    "belonging" =>  $tag_score
                );

                array_push($related_tags, $related_tag);
            }
        }

        // If all tests have been passed
        // Add Resource to the validated one
        $validated_resource = $element;

        // Set Price id
        $validated_resource['price_id'] = $this->pricesMappingDictionary[strtolower($element['price'])][0];
        unset($validated_resource['price']);

        // Set Type id
        $validated_resource['type_id'] = $this->typesMappingDictionary[strtolower($element['type'])][0];
        unset($validated_resource['type']);

        // Set Resources tags
        $validated_resource['related_tags'] = $related_tags;
        unset($validated_resource['tag']);

        array_push($this->validatedElements, $validated_resource);
    }
}