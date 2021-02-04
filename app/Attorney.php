<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Attorney extends Model
{
    public $timestamps = false;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'name',
        'signature'
    ];
}
