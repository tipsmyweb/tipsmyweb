<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

# Login
Route::post('login', 'AdminController@login');

# Tag
Route::get('main/tags', 'TagController@indexPublic');

# Suggestions
Route::apiResource('suggestions', 'SuggestionController')->only(['store']);

# Contacts
Route::apiResource('contacts', 'ContactController')->only(['store']);

# Resources
Route::post('resources/search', 'ResourceTagController@search');
Route::get('resources/image/{id}', 'ResourceController@getImage');
Route::get('resources/like/add/{id}', 'ResourceController@addLike');
Route::get('resources/like/remove/{id}', 'ResourceController@removeLike');
Route::get('resources/visit/{id}', 'ResourceController@addVisit');

# Test
Route::get('test', 'TestController@execute');

Route::post('search/admin', 'SearchController@adminGeneralSearch');

# Admin routes
Route::group(['middleware' => 'admin'], function () {

    # Resources
    Route::apiResource('resources', 'ResourceController')->only(['index', 'show',
        'store', 'update', 'destroy']);
    Route::post('import/resources', 'ResourceController@importResources');
    Route::post('import/validation/resources', 'ResourceController@validateImportedResources');
    Route::post('resources/image/{id}', 'ResourceController@uploadImage');

    # Tags
    Route::apiResource('tags', 'TagController')->only(['index', 'show',
        'store', 'update', 'destroy']);
    Route::post('import/validation/tags', 'TagController@validateImportedTags');
    Route::post('import/tags', 'TagController@importTags');
    Route::get('tags/disable/{id}', 'TagController@disableTag');
    Route::get('tags/enable/{id}', 'TagController@enableTag');
    Route::get('tags/restore/{id}', 'TagController@restoreTag');
    Route::get('tags/primary/{id}', 'TagController@tagIsPrimary');
    Route::get('tags/secondary/{id}', 'TagController@tagIsSecondary');

    # Suggestions
    Route::apiResource('suggestions', 'SuggestionController')->only(['index', 'destroy']);
    Route::get('suggestion/read/{id}', 'SuggestionController@suggestionRead');
    Route::get('suggestion/unread/{id}', 'SuggestionController@suggestionUnread');

    # Contacts
    Route::apiResource('contacts', 'ContactController')->only(['index', 'destroy']);
    Route::get('contact/read/{id}', 'ContactController@contactRead');
    Route::get('contact/unread/{id}', 'ContactController@contactUnread');

    # Prices
    Route::apiResource('prices', 'PriceController')->only(['index', 'store', 'show', 'update', 'destroy']);

    # Types
    Route::apiResource('types', 'TypeController')->only(['index', 'store', 'show', 'update', 'destroy']);

    # Logout
    Route::get('logout', 'AdminController@logout');

    # Log Controller
    Route::post('logs', 'LogController@getLogs');

    # Stat Controller
    Route::post('stats/tags/search', 'StatsController@getStatsTags');
    Route::post('stats/visitors/search', 'StatsController@getStatsVisitors');
    Route::get('stats/visitors/current', 'StatsController@getStatsVisitorsCurrentDay');
    Route::post('stats/resources/trend', 'StatsController@getTopTrendyResources');
    Route::get('stats/resources/alltime', 'StatsController@getTopAllTimeResources');
});
