<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Contact;
use App\Http\Requests\ContactRequest;
use App\Services\MailSender;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $contacts = Contact::all();
        return response()->json($contacts, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ContactRequest $request)
    {
        // Instance creation
        $c = new Contact();

        // Try to save the tag
        try {
            $c = $c->create($request->all());
        } catch(\Exception $e) {
            abort(500, "Can't save the resource");
        }

        MailSender::send_contact_request($request->message, $request->email);
        
        return response()->json();
    }


    /**
     * Set contact as read
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function contactRead(Request $request, $id)
    {
        $contact = Contact::findOrFail($id);

        // Try to save the tag
        try {
            $contact->read = true;
            $contact->save();
        } catch(\Exception $e) {
            abort(500, "Can't complete the action on the contact");
        }
        return response()->json();
    }


    /**
     * Set contact as unread
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function contactUnread(Request $request, $id)
    {
        $contact = Contact::findOrFail($id);

        // Try to save the tag
        try {
            $contact->read = false;
            $contact->save();
        } catch(\Exception $e) {
            abort(500, "Can't complete the action on the contact");
        }
        return response()->json();
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $c = Contact::findOrFail($id);

        // Try to delete
        try {
            $c->delete();
        } catch(\Exception $e) {
            abort(500, "Can't delete the resource");
        }
        return response()->json();
    }
}
