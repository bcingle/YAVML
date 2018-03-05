<?php

namespace yavml;

use PDO;

class VehicleDAO {

    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Fetch a single vehicle record by ID, or null if not found
     */
    public function findVehicle($userId, $vehicleId) {
        $query = 'SELECT * FROM VEHICLE WHERE ID = :id AND USER_ID = :userId';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $vehicleId);
        $stmt->bindParam(':userId', $userId);
        if ($stmt->execute()) {
            $row = $stmt->fetch();
            return $this->populateVehicleFromRow($row);
        }
    }

    public function findAllVehicles() {
        $query = 'SELECT * FROM VEHICLE';
        $stmt = $this->pdo->prepare($query);
        $vehicles = array();
        if ($stmt->execute()) {
            while (($row = $stmt->fetch()) != null) {
                $vehicle = $this->populateVehicleFromRow($row);
                array_push($vehicles, $vehicle);
            }
        }
        return $vehicles;
    }

    public function insertVehicle(Vehicle $vehicle) {
        $query = 'INSERT INTO VEHICLE (USER_ID, NAME, YEAR, MAKE, MODEL, TRIM, VIN, ODOMETER) '
            . 'VALUES (:userId, :name, :year, :make, :model, :trim, :vin, :odo)';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':userId', $vehicle->userId);
        $stmt->bindParam(':name', $vehicle->name);
        $stmt->bindParam(':year', $vehicle->year);
        $stmt->bindParam(':make', $vehicle->make);
        $stmt->bindParam(':model', $vehicle->model);
        $stmt->bindParam(':trim', $vehicle->trim);
        $stmt->bindParam(':vin', $vehicle->vin);
        $stmt->bindParam(':odo', $vehicle->odometer);
        $stmt->execute();
        $vehicle->id = $this->pdo->lastInsertId();
        return $vehicle;
    }

    public function findVehiclesByUser(User $user) {
        return $this->findVehiclesByUserId($user->userId);
    }

    public function findVehiclesByUserId($userId) {
        $query = 'SELECT * FROM VEHICLE WHERE USER_ID = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $userId);
        $vehicles = array();
        if ($stmt->execute()) {
            while (($row = $stmt->fetch()) != null) {
                $vehicle = $this->populateVehicleFromRow($row);
                array_push($vehicles, $vehicle);
            }
        }
        return $vehicles;
    }

    /**
     * Delete a vehicle log
     * @param $vehicle Either an instance of Vehicle or a vehicle ID
     * @return number of rows deleted
     */
    public function deleteVehicle($vehicle, $userId = null) {
        if ($vehicle instanceof Vehicle) {
            $vehicleId = $vehicle->id;
        } else {
            $vehicleId = $vehicle;
        }
        if (isset($userId)) {
            $query = 'DELETE FROM VEHICLE WHERE ID = :id AND USER_ID = :userId';
            $stmt = $this->pdo->prepare($query);
            $stmt->bindParam(':id', $vehicleId);
            $stmt->bindParam(':userId', $userId);
            return $stmt->execute();
        } else {
            $query = 'DELETE FROM VEHICLE WHERE ID = :id';
            $stmt = $this->pdo->prepare($query);
            $stmt->bindParam(':id', $vehicleId);
            return $stmt->execute();
        }
        
    }

    /**
     * Update a vehicle log.
     * @param $vehicle A vehicle log with updates
     * @return The number of affected rows (essentially 1 if updated, or 0 if not updated)
     */
    public function updateVehicle(Vehicle $vehicle) {
        $query = 'UPDATE VEHICLE SET USER_ID = :userId, ' 
            . 'NAME = :name, YEAR = :year, MAKE = :make, MODEL = :model, '
            . 'TRIM = :trim, VIN = :vin, ODOMETER = :odo '
            . 'WHERE ID = :id';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':userId', $vehicle->vehicleId);
        $stmt->bindParam(':name', $vehicle->name);
        $stmt->bindParam(':year', $vehicle->year);
        $stmt->bindParam(':make', $vehicle->make);
        $stmt->bindParam(':model', $vehicle->model);
        $stmt->bindParam(':trim', $vehicle->trim);
        $stmt->bindParam(':vin', $vehicle->vin);
        $stmt->bindParam(':odo', $vehicle->odo);
        $stmt->bindParam(':id', $vehicle->id);
        return $stmt->execute();
    }

    /**
     * Populate a Vehicle object from an associative array
     * of database data (a row)
     */
    private function populateVehicleFromRow(array $row, Vehicle $vehicle = null) {
        if ($vehicle === null) {
            $vehicle = new Vehicle();
        }
        $vehicle->id = $row['id'];
        $vehicle->userId = $row['user_id'];
        $vehicle->name = $row['name'];
        $vehicle->year = $row['year'];
        $vehicle->make = $row['make'];
        $vehicle->model = $row['model'];
        $vehicle->trim = $row['trim'];
        $vehicle->vin = $row['vin'];
        $vehicle->odometer = $row['odometer'];
        return $vehicle;
    }

}