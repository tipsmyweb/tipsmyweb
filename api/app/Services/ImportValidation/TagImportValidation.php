<?php

namespace App\Services\ImportValidation;

use App\Http\Requests\TagRequest;
use Illuminate\Support\Facades\Validator;

class TagImportValidation extends ImportValidationBase
{
    protected function ValidateElement(array $element, int $index)
    {
        $validation = Validator::make($element, (TagRequest::importRules()));

        if ($validation->fails())
        {
            $this->setElementErrorMessages($validation->errors()->messages(), $index);
            return;
        }

        array_push($this->validatedElements, $element);
    }
}