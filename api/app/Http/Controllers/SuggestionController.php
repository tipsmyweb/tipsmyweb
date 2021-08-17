<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Suggestion;
use App\Http\Requests\SuggestionRequest;

class SuggestionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $suggestions = Suggestion::all();
        return response()->json($suggestions, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SuggestionRequest $request)
    {
        // Instance creation
        $s = new Suggestion();

        // Try to save the tag
        try {
            $s = $s->create($request->all());
        } catch(\Exception $e) {
            abort(500, "Can't save the resource");
        }
        return response()->json();
    }


    /**
     * Set suggestion as read
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function suggestionRead(Request $request, $id)
    {
        $suggestion = Suggestion::findOrFail($id);

        // Try to save the tag
        try {
            $suggestion->read = true;
            $suggestion->save();
        } catch(\Exception $e) {
            abort(500, "Can't complete the action on the suggestion");
        }
        return response()->json();
    }


    /**
     * Set suggestion as unread
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function suggestionUnread(Request $request, $id)
    {
        $suggestion = Suggestion::findOrFail($id);

        // Try to save the tag
        try {
            $suggestion->read = false;
            $suggestion->save();
        } catch(\Exception $e) {
            abort(500, "Can't complete the action on the suggestion");
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
        $s = Suggestion::findOrFail($id);

        // Try to delete
        try {
            $s->delete();
        } catch(\Exception $e) {
            abort(500, "Can't delete the resource");
        }
        return response()->json();
    }
}
