<?php
include 'setupDB.php';

// Funktion zum Einfügen eines Spiels in die Tabelle
function insertPlay($einzeln, $spieltan, $dauer, $verlauf, $gewinner, $initiator, $mitspieler)
{
    global $conn;

    // Vorbereitung der SQL-Query
    $query = "INSERT INTO Spiel (einzeln, spieltan, dauer, verlauf, gewinner, initiator, mitspieler) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $statement = $conn->prepare($query);

    // Parameter-Binding (i=integer, s=string)
    $statement->bind_param("isissii", $einzeln, $spieltan, $dauer, $verlauf, $gewinner, $initiator, $mitspieler);

    // Ausführen der Query
    $result = $statement->execute();

    if ($result) {
        echo "Spiel erfolgreich eingefügt.<br>";
    } else {
        echo "Fehler beim Einfügen des Spiels: " . $statement->error . "<br>";
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
if (isset($_GET['player_id'])) {
    getPlayerPlays($_GET['player_id']);
}

insertPlay(true, "1984-12-03 17:30:00", 61, "Abgebrochen", NULL, 2, NULL);
insertPlay(false, "2001-03-26 15:03:23", 225, "Beendet", 2, 2, 3);
insertPlay(true, "2023-05-23 16:48:41", 300, "Abgelaufen", NULL, 2, NULL);
insertPlay(false, "2023-04-23 05:26:44", 725, "Beendet", 3, 2, 3);
insertPlay(true, "2023-04-22 06:10:18", 207, "Beendet", 2, 2, NULL);
?>