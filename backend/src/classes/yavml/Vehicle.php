<?php

namespace yavml;

class Vehicle {
    public $id;
    public $userId;
    public $name;
    public $year;
    public $make;
    public $model;
    public $trim;
    public $vin;
    public $odometer;

    public static function fromArray($arr) {
        $vehicle = new Vehicle();
        if (isset($arr['name'])) {
            $vehicle->name = $arr['name'];
        }
        if (isset($arr['year'])) {
            $vehicle->year = $arr['year'];
        }
        if (isset($arr['make'])) {
            $vehicle->make = $arr['make'];
        } 
        if (isset($arr['model'])) {
            $vehicle->model = $arr['model'];
        }
        if (isset($arr['trim'])) {
            $vehicle->trim = $arr['trim'];
        }
        if (isset($arr['vin'])) {
            $vehicle->vin = $arr['vin'];
        }
        if (isset($arr['odometer'])) {
            $vehicle->odometer = $arr['odometer'];
        }
        return $vehicle;
    }
}