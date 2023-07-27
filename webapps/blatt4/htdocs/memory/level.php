<?php
include 'setupDB.php';
function insertLevel($level, $anzahl_karten, $spielZeit) {
    global $conn;
    
    // Escape input values zur Verhinderung von SQL-Injection
    $level = mysqli_real_escape_string($conn, $level);
    $anzahl_karten = mysqli_real_escape_string($conn, $anzahl_karten);
    $spielZeit = mysqli_real_escape_string($conn, $spielZeit);

    // SQL-Abfrage zum Einfügen eines neuen Levels
    $sql = "INSERT INTO Level (level, anzahl_karten, spielZeit)
            VALUES ('$level', '$anzahl_karten', '$spielZeit')";

    if (mysqli_query($conn, $sql)) {
        echo "Neues Level erfolgreich eingefügt.";
    } else {
        echo "Fehler: " . $sql . "<br>" . mysqli_error($conn);
    }
}
?>