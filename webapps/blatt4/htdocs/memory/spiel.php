<?php
include 'setupDB.php';

// Funktion zum Einfügen eines Spiels in die Tabelle
function insertPlay($gameData)
{
    global $conn;

    // Vorbereitung der SQL-Query
    $query = "INSERT INTO Spiel (einzeln, spieltan, dauer, verlauf, gewinner, initiator, mitspieler) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $statement = $conn->prepare($query);

    // Parameter-Binding (i=integer, s=string)
    $statement->bind_param("isissii", $gameData['einzeln'], $gameData['spieltan'], $gameData['dauer'], $gameData['verlauf'], $gameData['gewinner'], $gameData['initiator'], $gameData['mitspieler']);

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

    // SQL query um die Spiele eines Spielers zu bekommen
    $query = "SELECT einzeln, spieltan, dauer, verlauf FROM Spiel WHERE initiator = '$playerId' OR mitspieler = '$playerId'";

    // Ausführen der query
    $result = mysqli_query($conn, $query);
    if ($result) {
        if (mysqli_num_rows($result) > 0) {
            $games = array();
            while ($row = mysqli_fetch_assoc($result)) {
                $game = array(
                    'einzeln' => $row['einzeln'],
                    'spieltan' => $row['spieltan'],
                    'dauer' => $row['dauer'],
                    'verlauf' => $row['verlauf']
                );
                $games[] = $game;
            }

            // Konvertieren des Arrays in das JSON-Format
            $json = json_encode($games);

            // Ausgabe des JSON
            header('Content-Type: application/json');
            echo $json;
        } else {
            echo "Keine Spiele gefunden für $playerId.<br>";
        }
    } else {
        echo "Fehler beim Abrufen von Spielen: " . mysqli_error($conn) . "<br>";
    }
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
}
?>