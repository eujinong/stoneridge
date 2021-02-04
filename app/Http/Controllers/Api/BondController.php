<?php
namespace App\Http\Controllers\Api;

use App\User;
use App\Client;
use App\Bond;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

use PDF;

class BondController extends Controller
{
  public function index()
  {
    $bonds = Bond::leftJoin('clients', 'clients.id', '=', 'bonds.client_id')
                ->select('bonds.*', 'clients.legal')
                ->get();

    return response()->json([
			'status' => 'success',
			'bonds' => $bonds
		], 200);
  }

  public function get($id)
  {
    $bond = Bond::leftJoin('clients', 'clients.user_id', '=', 'bonds.client_id')
                ->where('bonds.id', $id)
                ->select('bonds.*', 'clients.legal')
                ->first();

    return response()->json([
			'status' => 'success',
			'bond' => $bond
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

    Bond::create($data);

    $client = Client::where('user_id', $data['client_id'])->first();
    $data['legal'] = $client->legal;

    Storage::disk('local')->delete($bond_no . '.pdf');

    $pdf = PDF::loadView('pdf',array('data' => $data));
    $pdf->save('files/' . $bond_no . '.pdf');

    return response()->json([
      'status' => 'success',
      'message' => 'Your Bond Request processed successfully!',
      'bond_no' => $bond_no
		], 200);
  }

  public function update($id, Request $request)
  {
    $data = $request->all();

    foreach ($data as $key => $value) {
      if (is_null($value)) {
        $data[$key] = '';
      }
    }

    Bond::where('id', $id)->update($data);

    $client = Client::where('user_id', $data['client_id'])->first();
    $data['legal'] = $client->legal;

    Storage::disk('local')->delete($data['bond_no'] . '.pdf');

    $pdf = PDF::loadView('pdf',array('data' => $data));
    $pdf->save('files/' . $data['bond_no'] . '.pdf');

    return response()->json([
      'status' => 'success',
      'message' => 'Your Bond Request processed successfully!'
		], 200);
  }

  public function destroy($id)
  {
    $bond = Bond::find($id);

    Storage::disk('local')->delete($bond->bond_no . '.pdf');

    Bond::where('id', $id)->delete();

    $bonds = Bond::leftJoin('clients', 'clients.id', '=', 'bonds.client_id')
                ->select('bonds.*', 'clients.legal')
                ->get();

    return response()->json([
			'status' => 'success',
			'bonds' => $bonds
		], 200);
  }

  public function send($id)
  {
    $bond = Bond::leftJoin('users', 'users.id', '=', 'bonds.client_id')
                ->leftJoin('clients', 'clients.user_id', '=', 'bonds.client_id')
                ->leftJoin('users AS att', 'att.id', '=', 'clients.attorney')
                ->where('bonds.id', $id)
                ->select('bonds.bond_no', 'users.email AS from', 'att.email AS to')
                ->first();

    $message = "Hi\r\n";
		$message .= "A new Bond is created from " . $bond['from'] . "on Stoneridge Tender Bond Portal.\r\n";
		$message .= "Please find attachment for more information.\r\n";
		$message .= URL::to('/') . "/files/" . $bond['bond_no'] . ".pdf\r\n";
		$message .= "Best Regards.\r\n\r\nStoneridege Team";

		$headers = "From: admin@stoneridge.com";

    mail($data['to'], "Welcome to StoneRidge", $message, $headers);
    
    return response()->json([
			'status' => 'success'
		], 200);
  }
}