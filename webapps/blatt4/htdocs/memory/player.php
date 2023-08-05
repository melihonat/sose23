<?php
include 'setupDB.php';

// Funktion zum Einfügen eines Spielers in die Tabelle
function insertPlayer($name, $surname, $email, $password)
{
    global $conn;

    // Jeder Spieler fängt mit Level 0 an.
    $level = 0;

    // SQL-Query zum Einfügen des Spielers in die Tabelle
    $query = "INSERT INTO spieler (spielname, email, passwort, level) VALUES ('$name $surname', '$email', '$password', '$level')";

    // Prüfung auf Fehler bei der Query-Ausführung
    if (mysqli_query($conn, $query)) {
        $response = array('status' => 'registration_success');
        echo json_encode($response);
    } else {
        echo "Fehler beim Hinzufügen des Spielers: " . mysqli_error($conn) . "<br>";
    }
}

function loginPlayer($email, $password)
{
    global $conn;

    // SQL-Query zum Überprüfen der Anmeldedaten
    $query = "SELECT * FROM spieler WHERE email='$email' AND passwort='$password'";
    $result = mysqli_query($conn, $query);

    // Überprüfen, ob die Daten gefunden wurden
    if (mysqli_num_rows($result) === 1) {
        // Daten gefunden, Überprüfen ob es sich um einen Admin handelt
        $row = mysqli_fetch_assoc($result);
        $userID = $row['id'];
        $playerName = $row['spielname'];

        if ($userID === '1') { // Admin user ID = 1
            $responseData = array(
                'status' => 'admin_login_success',
                'data' => array(
                    'id' => $userID,
                    'name' => $playerName
                )
            );
            echo json_encode($responseData);
        } else {
            $responseData = array(
                'status' => 'login_success',
                'data' => array(
                    'id' => $userID,
                    'name' => $playerName
                )
            );
            echo json_encode($responseData);
        }
    } else {
        echo "login_failed";
    }
}

function logoutPlayer() {
    session_start();

    session_destroy();

    header("Location: \memory\Register & Login\index.html");
    exit;
}

if (isset($_GET['logout'])) {
    logoutPlayer();
}

// Prüfen, ob das Formular abgeschickt wurde
if (isset($_POST['email']) && isset($_POST['password']) && !isset($_POST['update_profile'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Überprüfung ob es ein Login-Versuch ist
    if (isset($_POST['login'])) {
        loginPlayer($email, $password);
    } else { // Ansonsten Registrierungsversuch
        $name = $_POST['name'];
        $surname = $_POST['surname'];
        $passwordRepeat = $_POST['password-repeat'];

        if ($password === $passwordRepeat) {
            insertPlayer($name, $surname, $email, $password);
        } else {
            echo "Passwörter stimmen nicht überein.<br>";
        }
    }
}

// Alle Spieler der Database fetchen
function getAllPlayers()
{
    global $conn;

    $query = "SELECT * FROM spieler";
    $result = mysqli_query($conn, $query);

    if (!$result) {
        die("Error fetching players: " . mysqli_error($conn));
    }

    $players = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $player = array(
            'id' => $row['id'],
            'name' => $row['spielname'],
            'email' => $row['email'],
            'level' => $row['level']
        );
        $players[] = $player;
    }
    return $players;
}

// Checken ob Request fürs Fetchen der Spielerdaten ist
if (isset($_GET['get_players'])) {
    $players = getAllPlayers();

    header('Content-Type: application/json');
    echo json_encode($players);
    exit;
}

function getPlayerData($playerId) {
    global $conn;

    $query = "SELECT * FROM spieler WHERE id = ?";
    $statement = mysqli_prepare($conn, $query);

    mysqli_stmt_bind_param($statement, "i", $playerId);
    mysqli_stmt_execute($statement);
    $result = mysqli_stmt_get_result($statement);

    $playerData = array();
    if ($row = mysqli_fetch_assoc($result)) {
        $playerData = array(
            'id' => $row['id'],
            'name' => $row['spielname'],
            'email' => $row['email'],
            'level' => $row['level']
        );
    }
    mysqli_stmt_close($statement);
    return $playerData;
}

// Checken ob Request fürs Fetchen der Spielerdaten ist
if (isset($_GET['get_player_data']) && isset($_GET['id'])) {
    $playerId = $_GET['id'];
    $playerData = getPlayerData($playerId);

    header('Content-Type: application/json');
    echo json_encode($playerData);
    exit;
}

function updatePlayerProfile($id, $name, $email, $password) {
    global $conn;

    $query = "UPDATE spieler SET spielname = ?, email = ?, passwort = ? WHERE id = ?";
    $statement = mysqli_prepare($conn, $query);
    
    mysqli_stmt_bind_param($statement, "sssi", $name, $email, $password, $id);
    $result = mysqli_stmt_execute($statement);

    mysqli_stmt_close($statement);

    return $result;
}

if (isset($_POST['update_profile'])) {

    if (isset($_POST['id'], $_POST['name'], $_POST['email'], $_POST['password'])) {
        $id = $_POST['id'];
        $name = $_POST['name'];
        $email = $_POST['email'];
        $password = $_POST['password'];

        $result = updatePlayerProfile($id, $name, $email, $password);

        if ($result) {
            echo json_encode(array('status' => 'update_success'));
        } else {
            echo "Error updating profile: " . mysqli_error($conn) . "<br>";
        }
    } else {
        echo "Required data missing from request.<br>";
    }
}

function deletePlayerProfile($id) {
    global $conn;

    $query = "DELETE FROM spieler WHERE id = ?";
    $statement = mysqli_prepare($conn, $query);

    mysqli_stmt_bind_param($statement, "i", $id);
    $result = mysqli_stmt_execute($statement);

    mysqli_stmt_close($statement);

    return $result;
}

if (isset($_GET['delete_profile'])) {
    if (isset($_POST['id'])) {
        $id = $_POST['id'];

        $result = deletePlayerProfile($id);

        if ($result) {
            echo json_encode(array('status' => 'delete_success'));
        } else {
            echo "Error deleting profile: " . mysqli_error($conn) . "<br>";
        }
    } else {
        echo "Required data missing from request.<br>";
    }
}

function updatePlayerXp ($playerId, $xpReward) {
    global $conn;

  // Get the player's current XP and level from the database
  $sql = "SELECT xp, level FROM spieler WHERE id = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i", $playerId);
  $stmt->execute();
  $result = $stmt->get_result();
  $player = $result->fetch_assoc();

  // Add the reward to the player's current XP
  $newXp = $player['xp'] + $xpReward;

  // Determine if the player levels up (this is a simple example)
  $newLevel = $player['level'];
  $hasLeveledUp = false;
  if ($newXp >= ($newLevel + 1) * 100) { // assuming 100 XP required for each level
    $newLevel++;
    $hasLeveledUp = true;
  }

  // Update the player's XP and level in the database
  $sql = "UPDATE spieler SET xp = ?, level = ? WHERE id = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("iii", $newXp, $newLevel, $playerId);
  $stmt->execute();

  // Return the updated XP and level
  return array("xp" => $newXp, "level" => $newLevel, "hasLeveledUp" => $hasLeveledUp);
}

if (isset($_GET['updatePlayerXp'])) {
    $playerId = $_GET['id'];
    $xpReward = $_GET['xp'];
    $result = updatePlayerXp($playerId, $xpReward);
    echo json_encode($result);
}  