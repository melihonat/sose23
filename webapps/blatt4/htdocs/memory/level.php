<?php
include 'setupDB.php';
function insertLevel($level, $anzahl_karten, $spielZeit) {
    global $conn;
    
    // Escape input values zur Verhinderung von SQL-Injection
    $level = mysqli_real_escape_string($conn, $level);
    $anzahl_karten = mysqli_real_escape_string($conn, $anzahl_karten);
    $spielZeit = mysqli_real_escape_string($conn, $spielZeit);

    // SQL-Abfrage zum Einfügen eines neuen Levels
    $query = "INSERT INTO Level (level, anzahl_karten, spielZeit) VALUES ('$level', '$anzahl_karten', '$spielZeit')";

    if (mysqli_query($conn, $query)) {
        echo "Neues Level erfolgreich eingefügt.";
    } else {
        echo "Fehler beim Hinzufügen des Levels: " . $query . "<br>" . mysqli_error($conn);
    }
}

function deleteLevel($levelId) 
{
    global $conn;

    $query = "DELETE FROM Level WHERE id = '$levelId'";

    if (mysqli_query($conn, $query)) {
        echo "Level erfolgreich gelöscht.";
    } else {
        echo "Fehler beim Löschen des Levels: " . mysqli_error($conn);
    }
}

// Prüfen, ob das Formular abgeschickt wurde
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['level']) && isset($_POST['anzahl_karten']) && isset($_POST['spielZeit'])) {
        $level = $_POST['level'];
        $anzahl_karten = $_POST['anzahl_karten'];
        $spielZeit = $_POST['spielZeit'];

        insertLevel($level, $anzahl_karten, $spielZeit);
    } else if(isset($_POST['deleteLevelId'])) {
        $levelId = $_POST['deleteLevelId'];
        deleteLevel($levelId);
    }
}

function fetchAllLevels()
{
    global $conn;

    $query = "SELECT * FROM Level";
    $result = mysqli_query($conn, $query);

    if (!$result) {
        die("Error fetching levels: " . mysqli_error($conn));
    }

    $levels = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $level = array(
            'level' => $row['level'],
            'anzahl_karten' => $row['anzahl_karten'],
            'spielZeit' => $row['spielZeit']
        );
        $levels[] = $level;
    }
    return $levels;
}

// Checken ob Request fürs Fetchen der Leveldaten ist
if (isset($_GET['getLevels'])) {
    $levels = fetchAllLevels();

    header('Content-Type: application/json');
    echo json_encode($levels);
    exit;
}
?>