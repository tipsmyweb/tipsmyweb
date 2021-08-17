<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// use Log;
use App\AdminToken;

class AdminController extends Controller
{

    private $username;
    private $password;

    public function __construct(){
        $this->username = config('auth.admin.username');
        $this->password = config('auth.admin.password');
    }

    /**
     * Function to login as admin
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        if ($request->username === $this->username && $request->password === $this->password) {

            // Create a token
            $token = $this->generateToken();
            AdminToken::create(array("token" => $token));
            \Log::info("Connexion ".\Carbon\Carbon::now());

            return response()->json(array("token" => $token));

            // return redirect('/#/login?token='.$token);

        } else {
            return response()->json(array("error" => "bad_credentials"), 401);
        }

    }

    /**
     * Function to generate a random token
     * @return String
     */
    private function generateToken($length=32){
        $token = bin2hex(random_bytes($length));
        return $token;
    }

    /**
     * Test function for Admin connection
     */
    public function test(){
        return response()->json(array("content" => "Successfull connection"));
    }

    /**
     * Function to logout from Admin
     */
    public function logout(Request $request){
        $token = $request->header("Authorization");
        $log = AdminToken::where('token', $token)->get()->first();
        $log->update(array('disabled' => true));
    }


}
