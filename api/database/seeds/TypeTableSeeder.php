<?php

use Illuminate\Database\Seeder;
use App\Type;

class TypeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $types = [
            'Website',
            'Software',
            'Application',
            'Account',
            'Video',
            'Company',
            'Extension',
            'Library'
        ];

        foreach($types as $type_name)
        {
            $t = new Type();
            $t->name = $type_name;
            $t->save();
        }        

    }
}
