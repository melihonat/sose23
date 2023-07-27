window.addEventListener('DOMContentLoaded', () => {
    // Fetch player information from the server and update the main menu
    fetchPlayerInformation();
});

function fetchPlayerInformation() {
    // You can use AJAX or fetch API to send a request to your server-side backend
    // to retrieve player data based on the logged-in player's ID.
    // Replace this example data with the actual data fetched from the server.
    const playerData = {
        id: 1,
        spielname: "Player Name", // Replace this with the actual player's name
        email: "player@example.com", // Replace this with the actual player's email
        level: 0,
    };

    // Update the player's name in the main menu
    const playerNameSpan = document.getElementById('player-name');
    playerNameSpan.innerText = playerData.spielname;

    // You can also update other player information in the main menu if needed
    // e.g., email, level, etc.
}
