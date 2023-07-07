<?php
include 'setupDB.php';

// Funktion zum Einfügen eines Spielers in die Tabelle
function insertPlayer($spielname, $email, $passwort, $level)
{
    global $conn;

    // SQL-Query zum Einfügen des Spielers in die Tabelle
    $query = "INSERT INTO spieler (spielname, email, passwort, level) VALUES ('$spielname', '$email', '$passwort', '$level')";

    // Prüfung auf Fehler bei der Query-Ausführung
    $result = mysqli_query($conn, $query);
    if ($result) {
        echo "Spieler erfolgreich hinzugefügt: $spielname, $email, $passwort, $level <br>";
    } else {
        echo "Fehler beim Hinzufügen des Spielers: " . mysqli_error($conn) . "<br>";
    }
}

// Prüfen, ob das Formular abgeschickt wurde
if (isset($_POST['submit'])) {
    $spielname = isset($_POST['spielname']) ? $_POST['spielname'] : '';
    $email = isset($_POST['email']) ? $_POST['email'] : '';
    $passwort = isset($_POST['passwort']) ? $_POST['passwort'] : '';
    $level = isset($_POST['level']) ? $_POST['level'] : '';

    // Einfügen eines neuen Players mit den angegebenen Daten
    insertPlayer($spielname, $email, $passwort, $level);
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Player Insertion</title>
</head>
<body>
    <form method="POST" action="player.php">
        <label for="spielname">Spielname:</label>
        <input type="text" id="spielname" name="spielname" required><br>

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required><br>

        <label for="passwort">Passwort:</label>
        <input type="password" id="passwort" name="passwort" required><br>

        <label for="level">Level:</label>
        <input type="number" id="level" name="level" required><br>

        <input type="submit" name="submit" value="Add Player">
    </form>
</body>
</html>