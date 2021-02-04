<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBondsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bonds', function (Blueprint $table) {
            $table->id();
            $table->string('bond_no', 20);
            $table->integer('client_id');
            $table->char('type', 1);
            $table->date('close_date');
            $table->time('close_time');
            $table->string('obligee', 80);
            $table->string('description', 120);
            $table->string('contract_no', 60);
            $table->float('contract_price', 10, 2);
            $table->boolean('bid_bond');
            $table->float('stipulate_amount', 10, 2);
            $table->float('percentage_amount', 10, 2);
            $table->boolean('agree_bond');
            $table->float('performance_bond', 10, 2);
            $table->float('lmpayment_bond', 10, 2);
            $table->string('warranty', 120);
            $table->integer('accept_period');
            $table->float('penalty_clause', 10, 2);
            $table->date('start_date');
            $table->date('end_date');
            $table->char('schedule', 1);
            $table->float('holdback_amount', 10, 2);
            $table->string('sublet', 256);
            $table->string('status', 20);
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
        Schema::dropIfExists('bonds');
    }
}
