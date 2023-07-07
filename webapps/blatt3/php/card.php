<?php
include 'setupDB.php';

function insertCard($imageName) {
    global $conn;

    $insertQuery = "INSERT INTO Karte (bild) VALUES (?)";
    $statement = $conn->prepare($insertQuery);

    $statement->bind_param("s", $imageName);

    $statement->execute();

    if ($statement->affected_rows > 0) {
        echo "Neue Kamerih-Karte erfolgreich erstellt.";
    } else {
        echo "Fehler beim Erstellen der Kamerih-Karte: " . $statement->error;
    }

    $statement->close();
}

// Prüfen, ob das Formular abgeschickt wurde
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_FILES["image"]) && $_FILES["image"]["error"] == 0) {
        $targetDir = "Kartenbilder/";
        $targetFile = $targetDir . basename($_FILES["image"]["name"]);
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
            insertCard($targetFile);
        } else {
            echo "Fehler beim Verschieben der hochgeladenen Datei.";
        }
    } else {
        echo "Keine Datei hochgeladen.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Einfügen einer Karte</title>
</head>
<body>
    <form method="POST" action="card.php" enctype="multipart/form-data">
        <label>Bild auswählen:</label>
        <input type="file" name="image" id="image"><br>
        <input type="submit" value="Insert Card">
    </form>
</body>
</html>
