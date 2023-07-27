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
        $response = array('id' => $userID, 'name' => $playerName);

        if ($userID === 1) { // Admin user ID = 1
            echo "admin_login_success";
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

// Prüfen, ob das Formular abgeschickt wurde
if (isset($_POST['email']) && isset($_POST['password'])) {
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

function getPlayerData($playerName) {
    global $conn;

    $query = "SELECT * FROM spieler WHERE spielname = ?";
    $statement = mysqli_prepare($conn, $query);

    mysqli_stmt_bind_param($statement, "s", $playerName);
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
if (isset($_GET['get_player_data']) && isset($_GET['name'])) {
    $playerName = $_GET['name'];
    $playerData = getPlayerData($playerName);

    header('Content-Type: application/json');
    echo json_encode($playerData);
    exit;
}