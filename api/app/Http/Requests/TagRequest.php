<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TagRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name'  =>  [
                'required',
                'string',
                'between:2,40',
                'unique:tags,name,'.\Request::instance()->id.',id',
            ],
            'primary' => [
                'boolean'
            ]
        ];
    }

    /**
     * Get rules of Tag for import
     * @return array
     */
    public static function importRules()
    {
        return [
            'name'  =>  [
                'required',
                'string',
                'between:2,40',
            ],
            'primary' => [
                'boolean'
            ]
        ];
    }
}
