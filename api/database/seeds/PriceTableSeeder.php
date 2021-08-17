<?php

use Illuminate\Database\Seeder;
use App\Price;

class PriceTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $prices = [
            'Free',
            'Freemium',
            '$',
            '$$',
            '$$$',
            'One-time purchase',
            'Free + Freemium',
            'Free + $',
            'Free + $$',
            'Free + $$$',
            'Free + One-time purchase'
        ];

        foreach($prices as $price_name) {
            $p = new Price();
            $p->name = $price_name;
            $p->save();
        }

    }
}
