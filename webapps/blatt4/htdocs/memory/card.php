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

function getAllCards() {
    global $conn;
    $selectQuery = "SELECT * FROM Karte";
    $result = $conn->query($selectQuery);

    $cards = array();
    while ($row = $result->fetch_assoc()) {
        $cards[] = $row;
    }
    return $cards;
}

function deleteCard($cardId) {
    global $conn;

    $deleteQuery = "DELETE FROM Karte WHERE id = ?";
    $statement = $conn->prepare($deleteQuery);

    $statement->bind_param("i", $cardId);

    $statement->execute();

    if ($statement->affected_rows > 0) {
        echo "Karte erfolgreich gelöscht.";
    } else {
        echo "Fehler beim Löschen der Karte.";
    }
    $statement->close();
}

// Prüfen, ob das Formular zum Löschen einer Karte ist
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["deleteCardId"])) {
    $cardId = $_POST["deleteCardId"];
    deleteCard($cardId);
}

// Gib alle Karten als JSON aus wenn das Request AJAX ist
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["getCards"])) {
    $cards = getAllCards();
    echo json_encode($cards);
}

// Checken ob das Formular zum Hinzufügen einer neuen Karte ist
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