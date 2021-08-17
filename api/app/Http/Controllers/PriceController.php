<?php

namespace App\Http\Controllers;

use App\Price;
use App\Http\Requests\PriceRequest;

class PriceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $prices = Price::all();
        return response()->json($prices, 200);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PriceRequest $request)
    {

        // Instance creation
        $price = new Price();

        // Try to save the price
        try {
            $price = $price->create($request->all());
        } catch(\Exception $e) {
            abort(500, "Can't save the resource");
        }

        return response()->json($price, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $price = Price::findOrFail($id);
        return response()->json($price, 200);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(PriceRequest $request, $id)
    {

        $price = Price::findOrFail($id);

        try {
            $price->update($request->all());
        } catch(\Exception $e) {
            abort(500, "Can't update the price");
        }

        return response()->json($price, 200);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $price = Price::findOrFail($id);

        // Try to delete
        try {
            $resources = $price->resources();
            foreach ($resources as $r) {
                $r->price_id = null;
                $r->save();
            }
            $price->delete();
        } catch(\Exception $e) {
            abort(500, "Can't delete the resource");
        }
        return response()->json();
    }
}
