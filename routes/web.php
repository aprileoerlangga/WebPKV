<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('visitor');
});

Route::get('/admin', function () {
    return view('admin');
});

Route::get('/welcome', function () {
    return view('welcome');
});
