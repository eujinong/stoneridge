<?php
namespace App\Http\Controllers\Api;

use App\User;
use App\Attorney;
use App\Client;
use App\Bond;

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

		if ($user->user_type == 'S' || $user->user_type == 'A') {
			$attorney = Attorney::where('user_id', $user->id)->first();
			$user->legal = $attorney->name;
		} else {
			$client = Client::where('user_id', $user->id)->first();
			$user->legal = $client->legal;
		}

		if ($user->active == 0) {
			return response()->json(
				[
					'status' => 'error',
					'message' => 'You have been deactivated. Please contact StoneRidge (800) 668-1653'
				],
				406
			);
		}

		return response()->json([
			'status' => 'success',
			'data' => [
				'token' => $token,
				'user' => $user
			]
		], 200);
	}

	public function auth(Request $request)
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
		$user->active = 1;
		$user->save();

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

		if ($data['user_type'] == 'S' || $data['user_type'] == 'A') {
			$data['signature'] = "";

			$base64_image = $request->input('signature');

			if ($base64_image != '') {
				if (preg_match('/^data:image\/(\w+);base64,/', $base64_image)) {
					$pos  = strpos($base64_image, ';');
					$type = explode(':', substr($base64_image, 0, $pos))[1];

					if (substr($type, 0, 5) == 'image') {
						$filename = preg_replace('/[^A-Za-z0-9\-]/', '', $data['name']) . '-' . date('Ymd_His');

						$type = str_replace('image/', '.', $type);

						$size = (int) (strlen(rtrim($base64_image, '=')) * 3 / 4);

						if ($size < 1050000) {
							$image = substr($base64_image, strpos($base64_image, ',') + 1);
							$image = base64_decode($image);
							
							Storage::disk('local')->put($filename . $type, $image);
			
							$data['signature'] = "files/" . $filename . $type;
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
				} else {
					return response()->json(
						[
							'status' => 'error',
							'message' => 'File type is not image.'
						],
						406
					);
				}
			} else {
				return response()->json(
					[
						'status' => 'error',
						'message' => 'Signature is required.'
					],
					406
				);
			}
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

		$user = User::create(array(
			'email' => $data['email'],
			'password' => Hash::make($password),
			'user_type' => $data['user_type'],
			'active' => 0
		));

		if ($data['user_type'] == 'S') {
			Attorney::create(array(
				'user_id' => $user->id,
				'name' => $data['name'],
				'signature' => $data['signature']
			));

			$admins = Attorney::leftJoin('users', 'users.id', '=', 'attorneys.user_id')
									->where('users.user_type', 'S')
									->select('users.*', 'attorneys.name', 'attorneys.signature')
									->orderBy('users.id', 'DESC')
									->get();

			return response()->json([
				'status' => 'success',
				'admins' => $admins
			], 200);
		} else if ($data['user_type'] == 'A') {
			Attorney::create(array(
				'user_id' => $user->id,
				'name' => $data['name'],
				'signature' => $data['signature']
			));

			$attorneys = Attorney::leftJoin('users', 'users.id', '=', 'attorneys.user_id')
									->select('users.*', 'attorneys.name', 'attorneys.signature')
									->orderBy('users.id', 'DESC')
									->get();

			return response()->json([
				'status' => 'success',
				'attorneys' => $attorneys
			], 200);
		} else {
			Client::create(array(
				'user_id' => $user->id,
				'legal' => $data['legal'],
				'attorney' => $data['attorney'],
				'producer' => $data['producer'],
			));

			$clients = Client::leftJoin('users', 'users.id', '=', 'clients.user_id')
							->leftJoin('attorneys', 'attorneys.user_id', '=', 'clients.attorney')
							->where('users.user_type', 'M')
							->orWhere('users.user_type', 'N')
							->select('users.*', 'attorneys.name',
											'clients.legal', 'clients.attorney', 'clients.producer')
							->orderBy('users.id', 'DESC')
							->get();

			return response()->json([
				'status' => 'success',
				'clients' => $clients
			], 200);
		}
	}

	public function update(Request $request)
	{
		$data = $request->all();

		$exist = User::where('email', $data['email'])
								->where('id', '!=', $data['id'])
								->first();
		
		if (!is_null($exist)) {
			return response()->json(
				[
					'status' => 'error',
					'message' => 'The email is already registerd. Please try again with another.'
				],
				406
			);
		}

		$user = User::find($data['id']);

		if ($user->user_type == 'N' && $data['user_type'] == 'M') {
			$bonds = Bond::where('client_id', $user->id)->get();

			foreach ($bonds as $bond) {
				Storage::disk('local')->delete($bond->bond_no . '.pdf');
			}

			Bond::where('client_id', $user->id)->delete();
		}

		User::where('id', $data['id'])
				->update(array(
					'email' => $data['email'],
					'user_type' => $data['user_type'],
					'active' => $data['active']
				));

		if ($user->user_type == 'S' || $user->user_type == 'A') {
			$attorney = Attorney::where('user_id', $user->id)->first();

			$data['signature'] = $attorney->signature;

			$base64_image = $request->input('signature');

			if ($base64_image != '') {
				if (preg_match('/^data:image\/(\w+);base64,/', $base64_image)) {
					$pos  = strpos($base64_image, ';');
					$type = explode(':', substr($base64_image, 0, $pos))[1];

					if (substr($type, 0, 5) == 'image') {
						$filename = preg_replace('/[^A-Za-z0-9\-]/', '', $data['name']) . '-' . date('Ymd_His');

						$type = str_replace('image/', '.', $type);

						$size = (int) (strlen(rtrim($base64_image, '=')) * 3 / 4);

						if ($size < 1050000) {
							$image = substr($base64_image, strpos($base64_image, ',') + 1);
							$image = base64_decode($image);
							
							Storage::disk('local')->delete(str_replace('files/', '', $user->signature));
							Storage::disk('local')->put($filename . $type, $image);
			
							$data['signature'] = "files/" . $filename . $type;
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
		}

		if ($user->user_type == 'S' || $user->user_type == 'A') {
			Attorney::where('user_id', $user->id)
						->update(array(
							'name' => $data['name'],
							'signature' => $data['signature']
						));

			$admins = Attorney::leftJoin('users', 'users.id', '=', 'attorneys.user_id')
									->where('users.user_type', 'S')
									->select('users.*', 'attorneys.name', 'attorneys.signature')
									->orderBy('users.id', 'DESC')
									->get();

			$attorneys = Attorney::leftJoin('users', 'users.id', '=', 'attorneys.user_id')
						->select('users.*', 'attorneys.name', 'attorneys.signature')
						->orderBy('id', 'DESC')
						->get();

			return response()->json([
				'status' => 'success',
				'admins' => $admins,
				'attorneys' => $attorneys
			], 200);
		} else {
			Client::where('user_id', $user->id)
						->update(array(
							'legal' => $data['legal'],
							'attorney' => $data['attorney'],
							'producer' => $data['producer']
						));

			$clients = Client::leftJoin('users', 'users.id', '=', 'clients.user_id')
						->leftJoin('attorneys', 'attorneys.user_id', '=', 'clients.attorney')
						->where('users.user_type', 'M')
						->orWhere('users.user_type', 'N')
						->select('users.*', 'attorneys.name',
										 'clients.legal', 'clients.attorney', 'clients.producer')
						->orderBy('users.id', 'DESC')
						->get();

			return response()->json([
				'status' => 'success',
				'clients' => $clients
			], 200);
		}
	}
	
	public function clients()
	{
		$clients = Client::leftJoin('users', 'users.id', '=', 'clients.user_id')
						->leftJoin('attorneys', 'attorneys.user_id', '=', 'clients.attorney')
						->where('users.user_type', 'M')
						->orWhere('users.user_type', 'N')
						->select('users.*', 'attorneys.name',
										 'clients.legal', 'clients.attorney', 'clients.producer')
						->orderBy('users.id', 'DESC')
						->get();

		return response()->json([
			'status' => 'success',
			'clients' => $clients
		], 200);
	}

	public function attorneys()
	{
		$attorneys = Attorney::leftJoin('users', 'users.id', '=', 'attorneys.user_id')
									->select('users.*', 'attorneys.name', 'attorneys.signature')
									->orderBy('id', 'DESC')
									->get();

		return response()->json([
			'status' => 'success',
			'attorneys' => $attorneys
		], 200);
	}

	public function admins()
	{
		$admins = Attorney::leftJoin('users', 'users.id', '=', 'attorneys.user_id')
											->where('users.user_type', 'S')
											->select('users.*', 'attorneys.name', 'attorneys.signature')
											->orderBy('users.id', 'DESC')
											->get();

		return response()->json([
			'status' => 'success',
			'admins' => $admins
		], 200);
	}
}