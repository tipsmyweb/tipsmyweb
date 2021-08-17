<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Type;
use App\Http\Requests\TypeRequest;

class TypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $types = Type::all();
        return response()->json($types, 200);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TypeRequest $request)
    {

        // Instance creation
        $type = new Type();

        // Try to save the type
        try {
            $type = $type->create($request->all());
        } catch(\Exception $e) {
            abort(500, "Can't save the resource");
        }

        return response()->json($type, 201);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $type = Type::findOrFail($id);
        return response()->json($type, 200);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(TypeRequest $request, $id)
    {

        $type = Type::findOrFail($id);

        try {
            $type->update($request->all());
        } catch(\Exception $e) {
            abort(500, "Can't update the price");
        }

        return response()->json($type, 200);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $type = Type::findOrFail($id);

        // Try to delete
        try {
            $resources = $type->resources();
            foreach ($resources as $r) {
                $r->type_id = null;
                $r->save();
            }
            $type->delete();
        } catch(\Exception $e) {
            abort(500, "Can't delete the resource");
        }
        return response()->json();
    }
}
