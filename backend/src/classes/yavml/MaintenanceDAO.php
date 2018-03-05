<?php

namespace yavml;

use PDO;

class MaintenanceDAO {

    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Fetch a single maintenance record by ID, or null if not found
     */
    public function findMaintenance($maintenanceId) {
        $query = 'SELECT * FROM MAINTENANCE WHERE ID = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $maintenanceId);
        if ($stmt->execute()) {
            $row = $stmt->fetch();
            return $this->populateMaintenanceFromRow($row);
        }
    }

    public function findAllMaintenance() {
        $query = 'SELECT * FROM MAINTENANCE';
        $stmt = $this->pdo->prepare($query);
        $maintenances = array();
        if ($stmt->execute()) {
            while (($row = $stmt->fetch()) != null) {
                $maintenance = $this->populateMaintenanceFromRow($row);
                array_push($maintenances, $maintenance);
            }
        }
        return $maintenances;
    }

    public function findMaintenanceByVehicle(Vehicle $vehicle) {
        return $this->findMaintenanceByVehicleId($vehicle->id);
    }

    public function findMaintenanceByVehicleId($vehicleId) {
        $query = 'SELECT * FROM MAINTENANCE WHERE VEHICLE_ID = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $vehicleId);
        $maintenances = array();
        if ($stmt->execute()) {
            while (($row = $stmt->fetch()) != null) {
                $maintenance = $this->populateMaintenanceFromRow($row);
                array_push($maintenances, $maintenance);
            }
        }
        return $maintenances;
    }

    /**
     * Delete a maintenance log
     * @param $maintenance Either an instance of Maintenance or a maintenance ID
     * @return number of rows deleted
     */
    public function deleteMaintenance($maintenance) {
        if ($maintenance instanceof Maintenance) {
            $maintenanceId = $maintenance->id;
        } else {
            $maintenanceId = $maintenance;
        }
        $query = 'DELETE FROM MAINTENANCE WHERE ID = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $maintenanceId);
        return $stmt->execute();
    }

    /**
     * Update a maintenance log.
     * @param $maintenance A maintenance log with updates
     * @return The number of affected rows (essentially 1 if updated, or 0 if not updated)
     */
    public function updateMaintenance(Maintenance $maintenance) {
        $query = 'UPDATE MAINTENANCE SET VEHICLE_ID = :vehId, ' 
            . 'DATE = :date, ODOMETER = :odo, MECHANIC = :mech, ' 
            . 'PRICE = :price WHERE ID = :id';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':vehId', $maintenance->vehicleId);
        $stmt->bindParam(':date', $maintenance->date);
        $stmt->bindParam(':odo', $maintenance->odometer);
        $stmt->bindParam(':mech', $maintenance->mechanic);
        $stmt->bindParam(':price', $maintenance->price);
        $stmt->bindParam(':id', $maintenance->id);
        return $stmt->execute();
    }

    /**
     * Populate a Maintenance object from an associative array
     * of database data (a row)
     */
    private function populateMaintenanceFromRow(array $row, Maintenance $maintenance = null) {
        if ($maintenance === null) {
            $maintenance = new Maintenance();
        }
        $maintenance->id = $row['id'];
        $maintenance->vehicleId = $row['vehicle_id'];
        $maintenance->date = $row['date'];
        $maintenance->odometer = $row['odometer'];
        $maintenance->mechanic = $row['mechanic'];
        $maintenance->price = $row['price'];
        return $maintenance;
    }

}