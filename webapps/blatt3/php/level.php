<?php
include 'setupDB.php';
function insertLevel($level, $anzahl_karten, $spielZeit) {
    global $conn;
    
    // Escape input values to prevent SQL injection
    $level = mysqli_real_escape_string($conn, $level);
    $anzahl_karten = mysqli_real_escape_string($conn, $anzahl_karten);
    $spielZeit = mysqli_real_escape_string($conn, $spielZeit);

    // SQL query to insert a new level
    $sql = "INSERT INTO Level (level, anzahl_karten, spielZeit)
            VALUES ('$level', '$anzahl_karten', '$spielZeit')";

    if (mysqli_query($conn, $sql)) {
        echo "New level inserted successfully";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }
}

// Example usage to insert two levels
insertLevel(1, 8, 60);
insertLevel(2, 16, 90);

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form inputs
    $level = $_POST['level'];
    $anzahl_karten = $_POST['anzahl_karten'];
    $spielZeit = $_POST['spielZeit'];

    // Call insertLevel function with form inputs
    insertLevel($level, $anzahl_karten, $spielZeit);
}
?>
