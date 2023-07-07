<?php
include 'setupDB.php';

function insertCard($imageName) {
    global $conn;

    $insertQuery = "INSERT INTO Karte (bild) VALUES (?)";
    $statement = $conn->prepare($insertQuery);

    $statement->bind_param("s", $imageName);

    $statement->execute();

    if ($statement->affected_rows > 0) {
        echo "New Kamerih card created successfully.";
    } else {
        echo "Error creating Kamerih card: " . $statement->error;
    }

    $statement->close();
}

// Nach Fehlern suchen
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_FILES["image"]) && $_FILES["image"]["error"] == 0) {
        $targetDir = "images/";
        $targetFile = $targetDir . basename($_FILES["image"]["name"]);
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
            insertCard($targetFile);
        } else {
            echo "Error moving the uploaded file.";
        }
    } else {
        echo "No file uploaded.";
    }
}

insertCard("c:/Users/Melih/Desktop/sose23/webapps/blatt3/Kartenbilder/5.png");
?>