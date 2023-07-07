<?php
include 'setupDB.php';

// Funktion zum Einfügen eines Spielers in die Tabelle
function insertPlayer($id, $spielname, $email, $passwort, $level)
{
    global $conn;

    // SQL-Abfrage zum Einfügen des Spielers in die Tabelle
    $query = "INSERT INTO spieler (id, spielname, email, passwort, level) VALUES ('$id', '$spielname', '$email', '$passwort', '$level')";

    // Überprüfen, ob der Spieler erfolgreich eingefügt wurde
    if (mysqli_query($conn, $query)) {
        echo "Spieler erfolgreich hinzugefügt: $id, $spielname, $email, $passwort, $level <br>";
    } else {
        echo "Fehler beim Hinzufügen des Spielers: " . mysqli_error($conn) . "<br>";
    }
}

// Überprüfen, ob das Formular gesendet wurde
if (isset($_POST['submit'])) {
    $id = isset($_POST['id']) ? $_POST['id'] : '';
    $spielname = isset($_POST['spielname']) ? $_POST['spielname'] : '';
    $email = isset($_POST['email']) ? $_POST['email'] : '';
    $passwort = isset($_POST['passwort']) ? $_POST['passwort'] : '';
    $level = isset($_POST['level']) ? $_POST['level'] : '';

    // Neuen Spieler mit den übermittelten Daten hinzufügen
    insertPlayer(1, "sakayolo", "merd@web.de", "Hund1234", "0");
}
?>