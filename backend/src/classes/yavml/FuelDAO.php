<?php

namespace yavml;

use PDO;

class FuelDAO {

    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Fetch a single fuel record by ID, or null if not found
     */
    public function findFuel($fuelId) {
        $query = 'SELECT * FROM FUEL WHERE ID = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $fuelId);
        if ($stmt->execute()) {
            $row = $stmt->fetch();
            return $this->populateFuelFromRow($row);
        }
    }

    public function findAllFuel() {
        $query = 'SELECT * FROM FUEL';
        $stmt = $this->pdo->prepare($query);
        $fuels = array();
        if ($stmt->execute()) {
            while (($row = $stmt->fetch()) != null) {
                $fuel = $this->populateFuelFromRow($row);
                array_push($fuels, $fuel);
            }
        }
        return $fuels;
    }

    public function findFuelByVehicle(Vehicle $vehicle) {
        return $this->findFuelByVehicleId($vehicle->id);
    }

    public function findFuelByVehicleId($vehicleId) {
        $query = 'SELECT * FROM FUEL WHERE VEHICLE_ID = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $vehicleId);
        $fuels = array();
        if ($stmt->execute()) {
            while (($row = $stmt->fetch()) != null) {
                $fuel = $this->populateFuelFromRow($row);
                array_push($fuels, $fuel);
            }
        }
        return $fuels;
    }

    /**
     * Delete a fuel log
     * @param $fuel Either an instance of Fuel or a fuel ID
     * @return number of rows deleted
     */
    public function deleteFuel($fuel) {
        if ($fuel instanceof Fuel) {
            $fuelId = $fuel->id;
        } else {
            $fuelId = $fuel;
        }
        $query = 'DELETE FROM FUEL WHERE ID = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $fuelId);
        return $stmt->execute();
    }

    /**
     * Update a fuel log.
     * @param $fuel A fuel log with updates
     * @return The number of affected rows (essentially 1 if updated, or 0 if not updated)
     */
    public function updateFuel(Fuel $fuel) {
        $query = 'UPDATE FUEL SET VEHICLE_ID = :vehId, ' 
            . 'DATE = :date, ODOMETER = :odo, QUANTITY = :quant, ' 
            . 'PRICE = :price WHERE ID = :id';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':vehId', $fuel->vehicleId);
        $stmt->bindParam(':date', $fuel->date);
        $stmt->bindParam(':odo', $fuel->odometer);
        $stmt->bindParam(':quant', $fuel->quantity);
        $stmt->bindParam(':price', $fuel->price);
        $stmt->bindParam(':id', $fuel->id);
        return $stmt->execute();
    }

    /**
     * Populate a Fuel object from an associative array
     * of database data (a row)
     */
    private function populateFuelFromRow(array $row, Fuel $fuel = null) {
        if ($fuel === null) {
            $fuel = new Fuel();
        }
        $fuel->id = $row['id'];
        $fuel->vehicleId = $row['vehicle_id'];
        $fuel->date = $row['date'];
        $fuel->odometer = $row['odometer'];
        $fuel->quantity = $row['quantity'];
        $fuel->price = $row['price'];
        return $fuel;
    }

}