<?php

use Illuminate\Database\Seeder;
use App\Price;
use App\Type;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        $this->call(PriceTableSeeder::class);
        $this->call(TypeTableSeeder::class);
        $this->call(ResourceTagTablesSeeder::class);

    }
}
