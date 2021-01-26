<?php
namespace App\Http\Controllers\Api;

use App\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Notifications\Messages\MailMessage;
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

		$message = '
			Geeeting from Stoneridge. Your account is created on the Stoneridge Tender Bond Portal.\n
			Click on below link to verify your email and change password.\n
			Temp password:
		';

		$message .= $password . '\n';
		$message .= 'Best Regards.\nStoneridege Team';

		(new MailMessage)
            ->greeting("Hi " . $data['email'])
            ->line($message);

		User::create(array(
			'email' => $data['email'],
			'password' => Hash::make($password),
			'user_type' => $data['user_type'],
			'last_bond_number' => 0,
			'legal' => $data['legal'],
			'active' => 1
		));

		$clients = User::where('legal', '!=', 'superadmin')->orderBy('id', 'DESC')->get();

		return response()->json([
			'status' => 'success',
			'clients' => $clients
		], 200);
	}
	
	public function clients()
	{
		$clients = User::where('legal', '!=', 'superadmin')->orderBy('id', 'DESC')->get();

		return response()->json([
			'status' => 'success',
			'clients' => $clients
		], 200);
	}
}