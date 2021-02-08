<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::namespace('Api')->group(function () {
    Route::post('login', 'UserController@login');
    Route::post('auth', 'UserController@auth');
    Route::post('forgot', 'ForgotPasswordController@forgot');
    Route::post('reset/{token}', 'ForgotPasswordController@reset');

    Route::group(['middleware' => ['jwt.verify']], function () {
        Route::get('clients', 'UserController@clients');
        Route::post('add-user', 'UserController@store');
        Route::put('update-user', 'UserController@update');

        Route::get('attorneys', 'UserController@attorneys');

        Route::Get('admins', 'UserController@admins');

        Route::get('bonds', 'BondController@index');
        Route::get('bond/{id}', 'BondController@get');
        Route::post('bond','BondController@store');
        Route::put('bond/{id}', 'BondController@update');
        Route::delete('bond/{id}', 'BondController@destroy');
        Route::get('send-bond/{id}', 'BondController@send');
        Route::get('approve-bond/{id}', 'BondController@approve');
    });
});
