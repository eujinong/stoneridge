<?php
namespace App\Http\Controllers\Api;

use App\Bond;

use Illuminate\Http\Request;

class BondController extends Controller
{
  public function index()
  {
    $bonds = Bond::get();

    return response()->json([
			'status' => 'success',
			'bonds' => $bonds
		], 200);
  }
}