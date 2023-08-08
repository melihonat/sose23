<?php
include 'setupDB.php';

// Funktion zum Einfügen eines Spiels in die Tabelle
function insertPlay($gameData)
{
    global $conn;

    // Vorbereitung der SQL-Query
    $query = "INSERT INTO Spiel (einzeln, spieltan, level, dauer, verlauf, gewinner, initiator, mitspieler) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $statement = $conn->prepare($query);

    // Parameter-Binding (i=integer, s=string)
    $statement->bind_param("isiissii", $gameData['einzeln'], $gameData['spieltan'], $gameData['level'], $gameData['dauer'], $gameData['verlauf'], $gameData['gewinner'], $gameData['initiator'], $gameData['mitspieler']);

    // Ausführen der Query
    $result = $statement->execute();

    if ($result) {
        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
    } else {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Error inserting game data']);
    }

    $statement->close();
}

// Funktion zum Abrufen von Partien eines Spielers im JSON-Format
function getPlayerPlays($playerId)
{
    global $conn;

    if ($playerId != null) {
        $playerId = intval($playerId);
        // SQL query um die Spiele eines Spielers zu bekommen
        $query = "SELECT einzeln, spieltan, level, dauer, gewinner, verlauf, initiator, mitspieler FROM Spiel WHERE initiator = ? OR mitspieler = ?";
        $statement = $conn->prepare($query);

        $statement->bind_param("ii", $playerId, $playerId);
    } else {
        // SQL query um alle Spiele zu bekommen, wenn keine player ID bereitgestellt wurde
        $query = "SELECT einzeln, spieltan, level, dauer, gewinner, verlauf FROM Spiel";
        $statement = $conn->prepare($query);
    }

    // Ausführen der query
    $result = $statement->execute();

    if ($result) {
        $result = $statement->get_result();

        if (mysqli_num_rows($result) > 0) {
            $games = array();
            while ($row = $result->fetch_assoc()) {
                $game = array(
                    'einzeln' => $row['einzeln'],
                    'spieltan' => $row['spieltan'],
                    'level' => $row['level'],
                    'dauer' => $row['dauer'],
                    'gewinner' => $row['gewinner'],
                    'verlauf' => $row['verlauf']
                );

                if (isset($row['initiator'])) {
                    $game['initiator'] = $row['initiator'];
                } else {
                    $game['initiator'] = null;
                }
            
                // Check if 'mitspieler' key exists before accessing it
                if (isset($row['mitspieler'])) {
                    $game['mitspieler'] = $row['mitspieler'];
                } else {
                    $game['mitspieler'] = null;
                }

                $games[] = $game;
            }

            // Konvertieren des Arrays in das JSON-Format
            $json = json_encode($games);

            // Ausgabe des JSON
            header('Content-Type: application/json');
            echo $json;
        } else {
            header('Content-Type: application/json');
            echo "[]";
        }
    } else {
        header('Content-Type: application/json');
        echo "[]";
    }
    $statement->close();
}

// Rufe die spiel.php Seite mit einem player_id-Parameter auf (z.B. "spiel.php?player_id=2")
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = file_get_contents('php://input');
    if ($postData) {
        $gameData = json_decode($postData, true);
        if ($gameData) {
            insertPlay($gameData);
        } else {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid data received']);
        }
    } else {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'No data received']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['get_player_plays']) && isset($_GET['id'])) {
        $playerId = $_GET['id'];
        getPlayerPlays($playerId);
    } elseif (isset($_GET['get_all_games'])){ // Get all games for admin panel
        $sql = "SELECT * FROM spiel";
        $result = $conn->query($sql);

        if ($result) {
            $games = array();
            while ($row = $result->fetch_assoc()) {
                $games[] = $row;
            }
            echo json_encode($games);
        } else {
            echo "Error fetching games.";
        }
        exit;
    }
}

function sendInvitation($invitedPlayerID, $selectedLevel) {
    // Davon ausgehen, dass die Einladung erfolgreich ist
    $response = array("success" => true);
    echo json_encode($response);
}

if ($_SERVER['REQUEST_METHOD'] === "POST" && isset($_POST["invite_player"])) {
    $invitedPlayerID = $_POST["invite_player"];
    $selectedLevel = $_POST["selected_level"];

    sendInvitation($invitedPlayerID, $selectedLevel);
}