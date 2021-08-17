<?php

namespace App\Services;

use Illuminate\Support\Carbon;

class DateUtils
{

    /**
     * Get custom data range
     * 
     */
    public static function getCustomDataRange($start_date, $end_date, array $data_structure)
    {
        $date_range = DateUtils::getDateRange($start_date, $end_date);
        $custom_data_range = array();

        foreach ($date_range as $date) {
            $custom_data_range[$date] = $data_structure;
            $custom_data_range[$date]['date'] = $date;
        }

        return $custom_data_range;
    }


    /**
     * Get date range between two dates
     * 
     */
    public static function getDateRange($start_date, $end_date){
        
        $start_date = Carbon::createFromFormat('Y-m-d', $start_date);
        $end_date = Carbon::createFromFormat('Y-m-d', $end_date);
        $dates = array();

        for($date = $start_date; $date->lte($end_date); $date->addDay()) {
            array_push($dates, $date->format('Y-m-d'));
        }
        
        return $dates;
    }


    /**
     * Get current date with format Y-m-d
     * 
     */
    public static function getCurrentDate()
    {
        return Carbon::now()->format('Y-m-d');
    }
}