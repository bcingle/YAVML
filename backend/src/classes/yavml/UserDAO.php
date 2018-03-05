<?php

namespace yavml;

use PDO;

class UserDAO {

    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Fetch a single user by ID, or null if user not found
     */
    public function findUser($userId) {
        $query = 'SELECT * FROM USER WHERE USER_ID = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $userId);
        if ($stmt->execute()) {
            if ($row = $stmt->fetch()) {
                return $this->populateUserFromRow($row);
            }
            
        }
    }

    public function findAllUsers() {
        $query = 'SELECT * FROM USER';
        $stmt = $this->pdo->prepare($query);
        $users = array();
        if ($stmt->execute()) {
            while ($row = $stmt->fetch()) {
                $user = $this->populateUserFromRow($row);
                array_push($users, $user);
            }
        }
        return $users;
    }

    /**
     * Delete a user
     * @param $user Either an instance of User or a user ID
     * @return number of rows deleted
     */
    public function deleteUser($user) {
        if ($user instanceof User) {
            $userId = $user->userId;
        } else {
            $userId = $user;
        }
        $query = 'DELETE FROM USER WHERE USER_ID = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $userId);
        return $stmt->execute($userId);
    }

    public function insertUser(User $user) {
        $query = 'INSERT INTO USER (user_id) VALUES (:id)';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $user->userId);
        if ($stmt->execute()) {
            $user->userId = $pdo->lastInsertId();
            return $user;
        }
    }

    public function updateUser(User $user) {
        // not implemented - no columns can be updated for a user
        // NOTE: user_id (primary key) is unmodifiable
    }

    /**
     * Populate a User object from an associative array
     * of database data (a row)
     */
    private function populateUserFromRow(array $row, User $user = null) {
        if ($user === null) {
            $user = new User();
        }
        $user->userId = $row['user_id'];
        // TODO: Add other properties if they are needed
        return $user;
    }

}