<?php
include 'setupDB.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'fetch':
        fetchGameState();
        break;
    case 'update':
        updateGameState();
        break;
    case 'checkWinner':
        checkForWinner();
        break;
    default:
        echo json_encode(['error' => 'Ungültige Aktion.']);
        break;
}

function fetchGameState() {
    global $conn;
    $invitation_id = $_GET['invitation_id'];

    $query = "SELECT * FROM invitations WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $invitation_id);
    $stmt->execute();

    $result = $stmt->get_result();
    $data = $result->fetch_assoc();

    echo json_encode($data);
}

function updateGameState() {
    global $conn;
    $invitation_id = $_POST['invitation_id'];
    $game_state = $_POST['game_state'];
    $current_turn = $_POST['current_turn'];

    $query = "UPDATE invitations SET gameState = ?, currentTurn = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ssi', $game_state, $current_turn, $invitation_id);
    $stmt->execute();

    echo json_encode(['success' => true]);
}

function checkForWinner() {
    // Logik um nach WIinner zu checken.
}

?>