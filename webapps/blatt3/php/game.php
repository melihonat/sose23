<?php
include 'setupDB.php';

// Function to insert a game into the table
function insertPlay($einzeln, $spieltan, $dauer, $verlauf, $gewinner, $initiator, $mitspieler)
{
    global $conn;

    // SQL query to insert the game into the table
    $query = "INSERT INTO Spiel (einzeln, spieltan, dauer, verlauf, gewinner, initiator, mitspieler) VALUES ('$einzeln', '$spieltan', '$dauer', '$verlauf', '$gewinner', '$initiator', '$mitspieler')";

    // Check for errors during query execution
    $result = mysqli_query($conn, $query);
    if ($result) {
        echo "Game successfully inserted.<br>";
    } else {
        echo "Error inserting game: " . mysqli_error($conn) . "<br>";
    }
}

// Check if the form is submitted
if (isset($_POST['submit'])) {
    $einzeln = isset($_POST['einzeln']) ? 1 : 0;
    $spieltan = isset($_POST['spieltan']) ? $_POST['spieltan'] : '';
    $dauer = isset($_POST['dauer']) ? $_POST['dauer'] : '';
    $verlauf = isset($_POST['verlauf']) ? $_POST['verlauf'] : '';
    $gewinner = isset($_POST['gewinner']) ? $_POST['gewinner'] : '';
    $initiator = isset($_POST['initiator']) ? $_POST['initiator'] : '';
    $mitspieler = isset($_POST['mitspieler']) ? $_POST['mitspieler'] : '';

    // Insert the game
    insertPlay($einzeln, $spieltan, $dauer, $verlauf, $gewinner, $initiator, $mitspieler);
}

// Function to get games of a player
function getPlayerPlays($playerId)
{
    global $conn;

    // SQL query to retrieve games of a player
    $query = "SELECT * FROM Spiel WHERE initiator = '$playerId' OR mitspieler = '$playerId'";

    // Execute the query
    $result = mysqli_query($conn, $query);
    if ($result) {
        if (mysqli_num_rows($result) > 0) {
            echo "Games of Player $playerId:<br>";
            while ($row = mysqli_fetch_assoc($result)) {
                echo "Game ID: " . $row['id'] . ", Einzeln: " . $row['einzeln'] . ", Spieltan: " . $row['spieltan'] . "<br>";
            }
        } else {
            echo "No games found for Player $playerId.<br>";
        }
    } else {
        echo "Error retrieving games: " . mysqli_error($conn) . "<br>";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Insert Game</title>
</head>
<body>
    <h2>Insert Game</h2>
    <form method="POST" action="spiel.php">
        <label>Einzeln:</label>
        <input type="checkbox" name="einzeln"><br>

        <label>Spieltan:</label>
        <input type="datetime-local" name="spieltan"><br>

        <label>Dauer:</label>
        <input type="number" name="dauer"><br>

        <label>Verlauf:</label>
        <textarea name="verlauf"></textarea><br>

        <label>Gewinner:</label>
        <input type="number" name="gewinner"><br>

        <label>Initiator:</label>
        <input type="number" name="initiator"><br>

        <label>Mitspieler:</label>
        <input type="number" name="mitspieler"><br>

        <input type="submit" name="submit" value="Insert Game">
    </form>
</body>
</html>
