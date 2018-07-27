<?php

namespace yavml;

use PDO;

class DocumentDAO {

    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Fetch a single document by ID, or null if not found
     */
    public function findDocument($docId) {
        $query = 'SELECT * FROM DOCUMENT WHERE ID = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $docId);
        if ($stmt->execute()) {
            $row = $stmt->fetch();
            return $this->populateDocumentFromRow($row);
        }
    }

    public function findVehicleDocumentByUser($userId, $docId) {
        $query = 'SELECT * FROM DOCUMENT '
            . 'INNER JOIN VEHICLE_DOCUMENT ON VEHICLE_DOCUMENT.DOCUMENT_ID = DOCUMENT.ID '
            . 'INNER JOIN VEHICLE ON VEHICLE.ID = VEHICLE_DOCUMENT.VEHICLE_ID '
            . 'INNER JOIN USER ON USER.USER_ID = VEHICLE.USER_ID '
            . 'WHERE DOCUMENT.ID = :docId AND USER.USER_ID = :userId';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':docId', $docId);
        $stmt->bindParam(':userId', $userId);
        if ($stmt->execute() && $stmt->columnCount() > 0) {
            var_dump($row);
            $row = $stmt->fetch();
            return $this->populateDocumentFromRow($row);
        }
    }

    public function insertDocumentForVehicle($vehicleId, Document $document) {
        $this->pdo->beginTransaction();
        try {
            $query = 'INSERT INTO DOCUMENT (filename, filetype, href, title) VALUES (:filename, :filetype, :href, :title)';
            $stmt = $this->pdo->prepare($query);
            $stmt->bindParam(':filename', $document->filename);
            $stmt->bindParam(':filetype', $document->filetype);
            $stmt->bindParam(':href', $document->href);
            $stmt->bindParam(':title', $document->title);
            if ($stmt->execute()) {
                $document->id = $this->pdo->lastInsertId();
                $query = 'INSERT INTO VEHICLE_DOCUMENT (VEHICLE_ID, DOCUMENT_ID) VALUES (:vehicleId, :documentId)';
                $stmt = $this->pdo->prepare($query);
                $stmt->bindParam(':vehicleId', $vehicleId);
                $stmt->bindParam(':documentId', $document->id);
                if ($stmt->execute()) {
                    $this->pdo->commit();
                    return $document;
                }
            }
            $this->pdo->rollback();
        } catch (Error $e) {
            $this->pdo->rollback();
            throw $e;
        }
    }

    public function findAllDocuments() {
        $query = 'SELECT * FROM DOCUMENT';
        $stmt = $this->pdo->prepare($query);
        $docs = array();
        if ($stmt->execute()) {
            while (($row = $stmt->fetch()) != null) {
                $doc = $this->populateDocumentFromRow($row);
                array_push($docs, $doc);
            }
        }
        return $docs;
    }

    public function findAllDocumentsByUserAndVehicle(User $user, Vehicle $vehicle) {
        return $this->findAllDocumentsByUserAndVehicleId($user->id, $vehicle->id);
    }

    public function findAllDocumentsByUserAndVehicleId($userId, $vehicleId) {
        $query = 'SELECT d.* FROM DOCUMENT d ' 
            . 'INNER JOIN VEHICLE_DOCUMENT ON VEHICLE_DOCUMENT.DOCUMENT_ID = d.ID '
            . 'INNER JOIN VEHICLE ON VEHICLE.ID = VEHICLE_DOCUMENT.VEHICLE_ID '
            . 'WHERE VEHICLE_DOCUMENT.VEHICLE_ID = :id AND VEHICLE.USER_ID = :userId';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $vehicleId);
        $stmt->bindParam(':userId', $userId);
        $docs = array();
        if ($stmt->execute()) {
            while (($row = $stmt->fetch()) != null) {
                $doc = $this->populateDocumentFromRow($row);
                array_push($docs, $doc);
            }
        }
        return $docs;
    }

    public function findAllDocumentsByMaintenance($maint) {
        return $this->findAllDocumentsByMaintenanceId($maint->id);
    }

    public function findAllDocumentsByMaintenanceId($maintenanceId) {
        $query = 'SELECT * FROM DOCUMENT ' 
            . 'JOIN MAINTENANCE_DOCUMENT ON MAINTENANCE_DOCUMENT.DOCUMENT_ID = DOCUMENT.ID '
            . 'WHERE MAINTENANCE_DOCUMENT.MAINTENANCE_ID = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $maintenanceId);
        $docs = array();
        if ($stmt->execute()) {
            while (($row = $stmt->fetch()) != null) {
                $doc = $this->populateDocumentFromRow($row);
                array_push($docs, $doc);
            }
        }
        return $docs;
    }

    public function findAllDocumentsByFuel($fuel) {
        return $this->findAllDocumentsByFuelId($fuel->id);
    }

    public function findAllDocumentsByFuelId($fuelId) {
        $query = 'SELECT * FROM DOCUMENT ' 
            . 'JOIN FUEL_DOCUMENT ON FUEL_DOCUMENT.DOCUMENT_ID = DOCUMENT.ID '
            . 'WHERE FUEL_DOCUMENT.FUEL_ID = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $fuelId);
        $docs = array();
        if ($stmt->execute()) {
            while (($row = $stmt->fetch()) != null) {
                $doc = $this->populateDocumentFromRow($row);
                array_push($docs, $doc);
            }
        }
        return $docs;
    }

    public function deleteDocumentByUserAndVehicle($userId, $vehicleId, $documentId) {
        error_log("User: $userId; Vehicle: $vehicleId; Document: $documentId");
        // a complex SQL query that will delete documents whose ID, Vehicle ID, and User ID
        // match what was passed (mostly just to make sure the user owns the vehicle and document)
        $query = 'DELETE d.* FROM DOCUMENT AS d '
            . 'INNER JOIN VEHICLE_DOCUMENT ON VEHICLE_DOCUMENT.DOCUMENT_ID = d.ID '
            . 'INNER JOIN VEHICLE ON VEHICLE.ID = VEHICLE_DOCUMENT.VEHICLE_ID '
            . 'INNER JOIN USER ON USER.USER_ID = VEHICLE.USER_ID '
            . 'WHERE d.ID = :docId AND VEHICLE.ID = :vehicleId AND USER.USER_ID = :userId';
        error_log("Query: $query");
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':docId', $documentId);
        $stmt->bindParam(':vehicleId', $vehicleId);
        $stmt->bindParam(':userId', $userId);
        return $stmt->execute() && $stmt->rowCount() > 0;
    }

    /**
     * Delete a document
     * @param $doc Either an instance of Document or a document ID
     * @return number of rows deleted
     */
    public function deleteDocument($doc) {
        if ($doc instanceof Document) {
            $docId = $doc->id;
        } else {
            $docId = $doc;
        }
        $query = 'DELETE FROM DOCUMENT WHERE ID = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $docId);
        return $stmt->execute($docId);
    }

    public function updateDocument(Document $doc) {
        $query = 'UPDATE DOCUMENT SET TITLE = :title, ' 
            . 'FILENAME = :filename, FILETYPE = :filetype, HREF = :href, ' 
            . 'WHERE ID = :id';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':title', $doc->title);
        $stmt->bindParam(':filename', $doc->filename);
        $stmt->bindParam(':filetype', $doc->filetype);
        $stmt->bindParam(':href', $doc->href);
        $stmt->bindParam(':id', $doc->id);
        return $stmt->execute();
    }

    /**
     * Populate a User object from an associative array
     * of database data (a row)
     */
    private function populateDocumentFromRow(array $row, Document $doc = null) {
        if ($doc === null) {
            $doc = new Document();
        }
        $doc->id = $row['id'];
        $doc->title = $row['title'];
        $doc->filename = $row['filename'];
        $doc->filetype = $row['filetype'];
        $doc->href = $row['href'];
        return $doc;
    }

}