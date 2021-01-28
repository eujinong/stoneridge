<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('password');
            $table->char('user_type', 1);
            $table->integer('last_bond_number');
            $table->string('legal');
            $table->string('signature', 256)->nullable();
            $table->boolean('active');
            $table->rememberToken();
            $table->timestamps();
        });

        DB::table('users')->insert(
            array(
                'email' => 'admin.stoneridge@gmail.com',
                'password' => Hash::make('Admin@1234@'),
                'user_type' => 'S',
                'last_bond_number' => 0,
                'legal' => 'superadmin',
                'active' => 1
            )
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
