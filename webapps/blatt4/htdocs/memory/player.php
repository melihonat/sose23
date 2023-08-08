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

function logoutPlayer()
{
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

function getPlayerData($playerId)
{
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

function getPlayersOnSameLevel($playerLevel)
{
    global $conn;

    $query = "SELECT * FROM spieler WHERE level = ?";
    $statement = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($statement, "i", $playerLevel);
    mysqli_stmt_execute($statement);
    $result = mysqli_stmt_get_result($statement);

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
    mysqli_stmt_close($statement);
    return $players;
}

if (isset($_GET['get_players_on_same_level']) && isset($_GET['level'])) {
    $playerLevel = $_GET['level'];
    $playersOnSameLevel = getPlayersOnSameLevel($playerLevel);

    header('Content-Type: application/json');
    echo json_encode($playersOnSameLevel);
    exit;
}

function updatePlayerProfile($id, $name, $email, $password)
{
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

function deletePlayerProfile($id)
{
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

function updatePlayerXp($playerId, $xpReward)
{
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

// Einladung senden
if (isset($_POST['action']) && $_POST['action'] == 'send_invite') {
    $inviterId = $_POST['inviter_id'];
    $inviteeId = $_POST['invitee_id'];

    // Gibt es noch eine aktive Einladung?
    $query = "SELECT id FROM invitations WHERE inviter_id = ? AND invitee_id = ? AND status = 'PENDING'";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ii', $inviterId, $inviteeId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invite already sent']);
        exit;
    }

    // Neue Einladung speichern
    $query = "INSERT INTO invitations (inviter_id, invitee_id) VALUES (?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ii', $inviterId, $inviteeId);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to send invite']);
    }
    exit;
}

// Nach Einladungen checken
if (isset($_GET['check_invite_for'])) {
    $playerId = $_GET['check_invite_for'];

    $query = "SELECT inviter_id, status FROM invitations WHERE invitee_id = ? AND status = 'PENDING' ORDER BY timestamp DESC LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $playerId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $invite = $result->fetch_assoc();

        // Name des Inviters fetchen
        $query = "SELECT spielname FROM spieler WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('i', $invite['inviter_id']);
        $stmt->execute();

        $inviterResult = $stmt->get_result();
        $inviter = $inviterResult->fetch_assoc();

        echo json_encode(['status' => 'success', 'inviterName' => $inviter['spielname'], 'inviterId' => $invite['inviter_id']]);
    } else {
        echo json_encode(['status' => 'no_invites']);
    }
    exit;
}

// Einladung annehmen/ablehnen
if (isset($_POST['action']) && $_POST['action'] == 'accept_invite') {
    $inviterId = $_POST['inviter_id'];
    $inviteeId = $_POST['invitee_id'];

    // Einladungsstatus auf "accepted"
    $query = "UPDATE invitations SET status = 'ACCEPTED' WHERE inviter_id = ? AND invitee_id = ? AND status = 'PENDING'";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ii', $inviterId, $inviteeId);
    $stmt->execute();

    echo json_encode(['status' => 'success', 'action' => 'accepted']);
    exit;
} else if (isset($_POST['action']) && $_POST['action'] == 'decline_invite') {
    $inviterId = $_POST['inviter_id'];
    $inviteeId = $_POST['invitee_id'];

    // Einladungsstatus auf "declined"
    $query = "UPDATE invitations SET status = 'REJECTED' WHERE inviter_id = ? AND invitee_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ii', $inviterId, $inviteeId);
    $stmt->execute();

    echo json_encode(['status' => 'success', 'action' => 'declined']);
    exit;
}

function markInvitationAsProcessed($invitationId)
{
    global $conn;
    $query = "UPDATE invitations SET status = 'PROCESSED' WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $invitationId);
    if (!$stmt->execute()) {
        error_log("Failed to mark invitation $invitationId as PROCESSED: " . $stmt->error);
    }
}

// Checken ob Einladung akzeptiert oder abgelehnt wurde
if (isset($_GET['check_invite_status_for'])) {
    $inviterId = $_GET['check_invite_status_for'];

    $query = "SELECT id, invitee_id, status FROM invitations WHERE inviter_id = ? AND status IN ('PENDING', 'ACCEPTED', 'REJECTED') ORDER BY timestamp DESC LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $inviterId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $invitation = $result->fetch_assoc();

        // Name des invitee
        $query = "SELECT spielname FROM spieler WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('i', $invitation['invitee_id']);
        $stmt->execute();
        $inviteeResult = $stmt->get_result();
        $invitee = $inviteeResult->fetch_assoc();

        echo json_encode(['status' => $invitation['status'], 'inviteeId' => $invitation['invitee_id'], 'inviteeName' => $invitee['spielname'], 'invitationId' => $invitation['id']]);

        if ($invitation['status'] === 'ACCEPTED' || $invitation['status'] === 'REJECTED') {
            markInvitationAsProcessed($invitation['id']);
        }
    }
    exit;
}
