<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['status' => 'API backend is running'];
});
