<?php

use Illuminate\Database\Seeder;
use App\Price;
use App\Type;
use App\Resource;
use App\ResourceTag;
use App\Tag;

class ResourceTagTablesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        if (config('app.env') === 'development') {
            
            $resources = array(
                array(
                    'name'  => 'Web Designer Trends',
                    'description'  => 'Download Royalty-free Commercial Use Vector Graphics and Images. 
                        Trendy vectors and more. Commercial License Vector. Download Vector, PNG, SVG. 
                        Royalty Free Vectors.',
                    'url'   =>  'http://www.webdesignertrends.com',
                    'language'  =>  'en',
                    'score'     =>  7,
                    'price_id'  =>  Price::where('slug', 'free')->get()->first()->id,
                    'type_id'   =>  Type::where('name', 'website')->get()->first()->id,
                    'interface' =>  2,
                    'tags'  => array(
                        'Graphic Design' => 7,
                        'Communication' => 8,
                    ),
                ),
                array(
                    'name'  => 'Vexels',
                    'description'  => 'Download Royalty-free Commercial Use Vector Graphics and Images. 
                        Trendy vectors and more. Commercial License Vector. Download Vector, PNG, SVG. 
                        Royalty Free Vectors.',
                    'url'   =>  'https://vexels.com',
                    'language'  =>  'en',
                    'score'     =>  7,
                    'price_id'  => Price::where('slug', 'free')->get()->first()->id,
                    'type_id'   => Type::where('name', 'website')->get()->first()->id,
                    'interface' =>  3,
                    'tags'  => array(
                        'Graphic Design' => 8,
                        'UI/UX' => 6,
                        'Communication' => 7
                    ),
                ),
                array(
                    'name'  => 'Pixabay',
                    'description'  => 'Download Royalty-free Commercial Use Vector Graphics and Images. 
                        Trendy vectors and more. Commercial License Vector. Download Vector, PNG, SVG. 
                        Royalty Free Vectors.',
                    'url'   =>  'https://pixabay.com',
                    'language'  =>  'en',
                    'score'     =>  6,
                    'price_id'  => Price::where('slug', 'free')->get()->first()->id,
                    'type_id'   => Type::where('name', 'website')->get()->first()->id,
                    'interface' =>  1,
                    'tags'  => array(
                        'Graphic Design' => 8,
                        'UI/UX' => 7,
                        'Communication' => 7
                    ),
                ),
                array(
                    'name'  => 'Rawpixel',
                    'description'  => 'Download Royalty-free Commercial Use Vector Graphics and Images. 
                        Trendy vectors and more. Commercial License Vector. Download Vector, PNG, SVG. 
                        Royalty Free Vectors.',
                    'url'   =>  'https://rawpixel.com',
                    'language'  =>  'en',
                    'score'     =>  7,
                    'price_id'  => Price::where('slug', 'free')->get()->first()->id,
                    'type_id'   => Type::where('name', 'website')->get()->first()->id,
                    'tags'  => array(
                        'Graphic Design' => 6,
                        'UI/UX' => 6,
                        'Communication' => 7
                    ),
                ),
                array(
                    'name'  => 'unDraw',
                    'description'  => 'Download Royalty-free Commercial Use Vector Graphics and Images. 
                        Trendy vectors and more. Commercial License Vector. Download Vector, PNG, SVG. 
                        Royalty Free Vectors.',
                    'url'   =>  'https://undraw.co/',
                    'language'  =>  'en',
                    'score'     =>  9,
                    'price_id'  => Price::where('slug', 'free')->get()->first()->id,
                    'type_id'   => Type::where('name', 'website')->get()->first()->id,
                    'tags'  => array(
                        'Graphic Design' => 10,
                        'UI/UX' => 10,
                        'Icons' => 8
                    ),
                ),
                array(
                    'name'  => 'Brusheezy',
                    'description'  => 'Download Royalty-free Commercial Use Vector Graphics and Images. 
                        Trendy vectors and more. Commercial License Vector. Download Vector, PNG, SVG. 
                        Royalty Free Vectors.',
                    'url'   =>  'https://brusheezy.com',
                    'language'  =>  'en,fr',
                    'score'     =>  8,
                    'price_id'  => Price::where('slug', 'freemium')->get()->first()->id,
                    'type_id'   => Type::where('name', 'website')->get()->first()->id,
                    'tags'  => array(
                        'Graphic Design' => 8,
                        'Architecture' => 8,
                    ),
                ),
                array(
                    'name'  => 'MapBox',
                    'description'  => 'Download Royalty-free Commercial Use Vector Graphics and Images. 
                        Trendy vectors and more. Commercial License Vector. Download Vector, PNG, SVG. 
                        Royalty Free Vectors.',
                    'url'   =>  'https://www.mapbox.com/',
                    'language'  =>  'fr',
                    'score'     =>  8,
                    'price_id'  => Price::where('slug', 'free')->get()->first()->id,
                    'type_id'   => Type::where('name', 'website')->get()->first()->id,
                    'tags'  => array(
                        'Graphic Design' => 7,
                        'Architecture' => 8,
                    ),
                ),
                        
            );

            foreach ($resources as $resource) {
                $tags = $resource['tags'];
                unset($resource['tags']);
                $r = Resource::create($resource);
                foreach($tags as $tag_name => $resource_tag_belonging){
                    $tag = Tag::firstOrCreate(['name' => $tag_name]);
                    $rt = new ResourceTag();
                    $rt->tag_id = $tag['id'];
                    $rt->resource_id = $r->id;
                    $rt->belonging = $resource_tag_belonging;
                    $rt->save();
                }
            }


            $primary_tags = [
                'Graphic Design',
                'Architecture',
                'Productivity',
                'Streaming'
            ];

            foreach($primary_tags as $tag_name){
                $tag = Tag::firstOrCreate(['name' => $tag_name]);
                $tag->primary = true;
                $tag->save();
            }

        }

    }
}
