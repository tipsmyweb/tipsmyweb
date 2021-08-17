<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateResourcesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::create('resources', function (Blueprint $table) {
            $table->charset = 'utf8';
            $table->collation = 'utf8_unicode_ci';
            $table->uuid('id');
            $table->primary('id');
            $table->string('name', 40)->unique();
            $table->text('description')->nullable();
            $table->string('url', 150)->unique();
            $table->string('image', 100)->nullable();
            $table->string('language', 30);
            $table->smallInteger('score')->default(1);
            $table->smallInteger('interface')->default(1);
            $table->smallInteger('renown')->default(1);
            $table->uuid('price_id');
            $table->foreign('price_id')->references('id')->on('prices');
            $table->uuid('type_id');
            $table->foreign('type_id')->references('id')->on('types');
            $table->integer('like')->default(0);
            $table->integer('visits')->default(0);
            $table->timestamps();
        });        

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('resources');
    }
}
