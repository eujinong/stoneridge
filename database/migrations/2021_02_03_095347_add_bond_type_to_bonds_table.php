<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBondTypeToBondsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('bonds', function (Blueprint $table) {
            $table->boolean('bid_bond')->after('contract_price');
            $table->boolean('agree_bond')->after('percentage_amount');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('bonds', function (Blueprint $table) {
            $table->dropColumn(['bid_bond']);
            $table->dropColumn(['agree_bond']);
        });
    }
}
