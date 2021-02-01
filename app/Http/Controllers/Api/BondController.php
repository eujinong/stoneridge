<?php
namespace App\Http\Controllers\Api;

use App\Bond;

use Illuminate\Http\Request;

use Log;

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

  public function store(Request $request)
  {
    $data = $request->all();

    $bond_no = '37-4458-';

    $id = '';
    for ($i = 0; $i < 5 - strlen($data['client_id']); $i++) {
      $id .= '0';
    }

    $id .= $data['client_id'];

    $bond_no .= $id . '-' . date('y') . '-';

    $last_bond = Bond::where('client_id', $data['client_id'])
                ->orderBy('id', 'DESC')
                ->first();

    if ($last_bond) {
      $str = $last_bond->bond_no;
      $str = substr($str, strlen($str) - 3, 3);

      $num = (int)$str;
      $num++;

      $str = '';

      for ($i = 0; $i < 3 - strlen($num); $i++) {
        $str .= '0';
      }

      $str .= $num;
    } else {
      $str = '001';
    }

    $bond_no .= $str;

    $data['bond_no'] = $bond_no;

    foreach ($data as $key => $value) {
      if (is_null($value)) {
        $data[$key] = '';
      }
    }

    $data['created_at'] = date('Y-m-d H:i:s');
    $data['updated_at'] = date('Y-m-d H:i:s');

    Bond::create($data);

    return response()->json([
      'status' => 'success',
      'message' => 'Your Bond Request stored successfully!'
		], 200);
  }
}