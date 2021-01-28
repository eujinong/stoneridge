<?php
namespace App\Http\Controllers\Api;

use App\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class UserController extends Controller
{
  public function login(Request $request)
  {
    $validator = Validator::make(
			$request->all(),
			[
				'email' => 'required|string|max:255',
				'password' => 'required|string|min:6',
			]
		);

		if ($validator->fails()) {
			return response()->json(
				[
					'status' => 'fail',
					'data' => $validator->errors(),
				],
				422
			);
    }
    
    $credentials = $request->only('email', 'password');
		try {
			if (!$token = JWTAuth::attempt($credentials)) {
				return response()->json(
					[
						'status' => 'error',
						'message'=> 'Invalid credentials.'
					],
					406
				);
			}
		} catch (JWTException $e) {
			return response()->json(
				[
					'status' => 'error',
					'message' => 'Invalid credentials.'
				],
				406
			);
		}

		$user = User::where('email', $request->email)->first();

		return response()->json([
			'status' => 'success',
			'data' => [
				'token' => $token,
				'user' => $user
			]
		], 200);
	}

	public function store(Request $request)
	{
		$data = $request->all();

		$exist = User::where('email', $data['email'])->first();

		if ($exist) {
			return response()->json(
				[
					'status' => 'error',
					'message' => 'The email address is already registered.'
				],
				406
			);
		}

		$characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		$password = '';
		for ($i = 0; $i < 6; $i++) {
			$password .= $characters[rand(0, 61)];
		}

		$message = "Hi " . $data['email'] . "\r\n";
		$message .= "Geeeting from Stoneridge.\r\n";
		$message .= "Your account is created on the Stoneridge Tender Bond Portal.\r\n";
		$message .= "Click on below link to verify your email and change password.\r\n";
		$message .= URL::to('/') . "/authemail?email=" . $data['email'] . "\r\n";
		$message .= "Temp password: " . $password . "\r\n\r\n";
		$message .= "Best Regards.\r\n\r\nStoneridege Team";

		$headers = "From: admin@stoneridge.com";

		mail($data['email'], "Welcome to StoneRidge", $message, $headers);
		
		$data['signature'] = "";

		$base64_image = $request->input('signature');

		if ($base64_image != '' && preg_match('/^data:image\/(\w+);base64,/', $base64_image)) {
      $pos  = strpos($base64_image, ';');
      $type = explode(':', substr($base64_image, 0, $pos))[1];

      if (substr($type, 0, 5) == 'image') {
        $filename = preg_replace('/[^A-Za-z0-9\-]/', '', $data['legal']) . '-' . date('Ymd_His');

        $type = str_replace('image/', '.', $type);

        $size = (int) (strlen(rtrim($base64_image, '=')) * 3 / 4);

        if ($size < 1050000) {
          $image = substr($base64_image, strpos($base64_image, ',') + 1);
          $image = base64_decode($image);
          
          Storage::disk('local')->put($filename . $type, $image);
  
          $data['signature'] = "photos/" . $filename . $type;
        } else {
          return response()->json(
            [
              'status' => 'error',
              'message' => 'File size must be less than 1MB.'
            ],
            406
          );
        }
      } else {
        return response()->json(
          [
            'status' => 'error',
            'message' => 'File type is not image.'
          ],
          406
        );
      }
    }

		User::create(array(
			'email' => $data['email'],
			'password' => Hash::make($password),
			'user_type' => $data['user_type'],
			'last_bond_number' => 0,
			'legal' => $data['legal'],
			'signature' => $data['signature'],
			'active' => 0
		));

		$clients = User::where('user_type', '!=', 'S')
									->where('user_type', '!=', 'A')
									->orderBy('id', 'DESC')
									->get();

		$attorneys = User::where('user_type', 'A')
									->orderBy('id', 'DESC')
									->get();

		return response()->json([
			'status' => 'success',
			'clients' => $clients,
			'attorneys' => $attorneys
		], 200);
	}

	public function update(Request $request)
	{
		$data = $request->all();

		$user = User::where('email', $data['email'])->first();

		$data['signature'] = "";

		$base64_image = $request->input('signature');

		if ($base64_image != '' && preg_match('/^data:image\/(\w+);base64,/', $base64_image)) {
      $pos  = strpos($base64_image, ';');
      $type = explode(':', substr($base64_image, 0, $pos))[1];

      if (substr($type, 0, 5) == 'image') {
        $filename = preg_replace('/[^A-Za-z0-9\-]/', '', $data['legal']) . '-' . date('Ymd_His');

        $type = str_replace('image/', '.', $type);

        $size = (int) (strlen(rtrim($base64_image, '=')) * 3 / 4);

        if ($size < 1050000) {
          $image = substr($base64_image, strpos($base64_image, ',') + 1);
          $image = base64_decode($image);
					
					Storage::disk('local')->delete(str_replace('photos/', '', $user->signature));
          Storage::disk('local')->put($filename . $type, $image);
  
          $data['signature'] = "photos/" . $filename . $type;
        } else {
          return response()->json(
            [
              'status' => 'error',
              'message' => 'File size must be less than 1MB.'
            ],
            406
          );
        }
      } else {
        return response()->json(
          [
            'status' => 'error',
            'message' => 'File type is not image.'
          ],
          406
        );
      }
    }

		User::where('email', $data['email'])
				->update(array(
					'legal' => $data['legal'],
					'signature' => $data['signature'],
					'active' => $data['active']
				));

		$clients = User::where('user_type', '!=', 'S')
									->where('user_type', '!=', 'A')
									->orderBy('id', 'DESC')
									->get();

		$attorneys = User::where('user_type', 'A')
									->orderBy('id', 'DESC')
									->get();

		return response()->json([
			'status' => 'success',
			'clients' => $clients,
			'attorneys' => $attorneys
		], 200);
	}
	
	public function clients()
	{
		$clients = User::where('user_type', '!=', 'S')
									->where('user_type', '!=', 'A')
									->orderBy('id', 'DESC')
									->get();

		return response()->json([
			'status' => 'success',
			'clients' => $clients
		], 200);
	}

	public function attorneys()
	{
		$attorneys = User::where('user_type', 'A')
									->orderBy('id', 'DESC')
									->get();

		return response()->json([
			'status' => 'success',
			'attorneys' => $attorneys
		], 200);
	}
}