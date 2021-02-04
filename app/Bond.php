<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Bond extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'bond_no',
        'client_id',
        'type',
        'close_date',
        'close_time',
        'obligee',
        'description',
        'contract_no',
        'contract_price',
        'bid_bond',
        'stipulate_amount',
        'percentage_amount',
        'agree_bond',
        'performance_bond',
        'lmpayment_bond',
        'warranty',
        'accept_period',
        'penalty_clause',
        'start_date',
        'end_date',
        'schedule',
        'holdback_amount',
        'sublet',
        'status'
    ];
}
