<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('logs', function (Blueprint $table) {
            $table->charset = 'utf8';
            $table->collation = 'utf8_unicode_ci';
            $table->bigIncrements('id');
            $table->text('description')->nullable();
            $table->enum('level', ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug']);
            $table->string('hashed_ip')->nullable();
            $table->string('created_date', 20);
            $table->index('created_date');
            $table->bigInteger('route_id')->unsigned()->nullable();
            $table->foreign('route_id')->references('id')->on('log_routes');
            $table->bigInteger('geoip_id')->unsigned()->nullable();
            $table->foreign('geoip_id')->references('id')->on('log_geoips');
            $table->bigInteger('token_id')->unsigned()->nullable();
            $table->foreign('token_id')->references('id')->on('admin_token');
            $table->text('parameters')->nullable();
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
        Schema::dropIfExists('logs');
    }
}
