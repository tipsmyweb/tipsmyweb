<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App;
use App\Services\Logs\LogCreator;
use Illuminate\Database\Schema\Builder;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        App::singleton('LogCreator', function() {
            return new LogCreator();
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Builder::defaultStringLength(191);
    }
}
