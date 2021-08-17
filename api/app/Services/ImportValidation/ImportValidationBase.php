<?php

namespace App\Services\ImportValidation;

abstract class ImportValidationBase
{
    protected $elements;
    protected $validatedElements;
    protected $elementsErrors;

    public function __construct(array $elements)
    {
        $this->elements = $elements;
        $this->validatedElements = array();
        $this->elementsErrors = array();

        $this->InitializeValidation();
        $this->RunElementsValidation();
    }

    public function GetElementsErrors(): array
    {
        return $this->elementsErrors;
    }

    public function GetValidatedElements(): array
    {
        return $this->validatedElements;
    }

    public function GetNumberOfImportedElements(): int
    {
        return sizeof($this->elements);
    }

    protected function InitializeValidation(){}

    protected function RunElementsValidation()
    {
        $elementLine = 1; // Element line in Excel File (Take into account header)
        foreach ($this->elements as $element)
        {
            $this->ValidateElement($element, $elementLine);

            $elementLine +=1 ;
        }
    }

    protected abstract function ValidateElement(array $element, int $index);

    protected function setElementErrorMessages(array $errorMessages, int $index)
    {
        foreach (array_keys($errorMessages) as $key)
        {
            foreach (array_values($errorMessages[$key]) as $message)
            {
                $this->setElementErrorMessage($index, $key, $message);
            }
        }
    }

    protected function setElementErrorMessage(int $index, string $key, string $errorMessage)
    {
        $message = 'Element line '.$index.' : '.$key.' => '.$errorMessage;
        array_push($this->elementsErrors, $message);
    }
}