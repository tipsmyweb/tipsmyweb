<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResourceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        array_merge([], ResourceRequest::baseRules());
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return array_merge([
            'name' =>  [
                'required', 
                'unique:resources,name,'.\Request::instance()->id.',id', 
                'string', 
                'between:3,40',
            ],
            'url'  =>   [
                'required',
                'unique:resources,url,'.\Request::instance()->id.',id',
                'url',
                'string',
                'between:2,150',
            ],
            'image'  =>  [
                'nullable',
                'image',
            ],
            'type_id'  => [
                'required',
                'exists:types,id',
            ],
            'price_id'  =>  [
                'required',
                'exists:prices,id',
            ]],
        $this->baseRules());
    }

    /**
     * Get base rules of Resource
     * @return array
     */
    public static function baseRules()
    {
        return [
            'description'   =>  [
                'nullable',
                'string',
                'between:0,250',
            ],
            'language'  => [
                'required',
                'string',
                'in:fr,en,"en,fr",es,"en,es","fr,es","en,fr,es"'
            ],
            'score'   =>  [
                'integer',
                'min:1',
                'max:10',
            ],
            'interface'  => [
                'integer',
                'min:1',
                'max:3',
            ],
            'renown'  => [
                'integer',
                'min:1',
                'max:3',
            ],
            'like'   =>  [
                'nullable',
                'integer',
                'min:0',
            ],
        ];
    }

    /**
     * Get rules of Resource for import
     * @return array
     */
    public static function importRules()
    {
        return array_merge([
            'name' =>  [
                'required',
                'string',
                'between:3,40',
            ],
            'url'  =>   [
                'required',
                'url',
                'string',
                'between:2,150',
            ],
            'type'  => [
                'required',
                'exists:types,name',
            ],
            'price'  =>  [
                'required',
                'exists:prices,name',
            ]],
            ResourceRequest::baseRules());
    }
}
