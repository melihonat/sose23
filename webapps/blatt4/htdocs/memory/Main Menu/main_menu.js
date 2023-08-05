// Funktion um Query-Parameter aus der URL zu lesen (z.B. ID)
function getQueryParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]'); // JS String Methode, um eckige Klammern durch Backslashes zu maskieren (um Sonderzeichen richtig zu kodieren)
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'); // Diese line soll einen bestimmten Query-Parameter in der URL abgleichen
    var results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' ')); // Erzeugt von Menschen lesbaren String
}

// Welcome Nachricht, sodass der playerName angezeigt wird
document.addEventListener("DOMContentLoaded", function () {
    var profileLink = document.getElementById("profile-link");
    var playerId = getQueryParameter('id');
    var playerName = getQueryParameter('name');

    document.getElementById('player-name').textContent = playerName;

    profileLink.href = "../Admin Panel/profil.html?id=" + encodeURIComponent(playerId) + "&name=" + encodeURIComponent(playerName);

    var startGameLink = document.getElementById("start-game-link");
    startGameLink.addEventListener("click", function (e) {
        e.preventDefault();

        var url = "../Game/level_selection.html";

        if (playerId) {
            url += "?id=" + encodeURIComponent(playerId);
        }

        if (playerName) {
            url += "&name=" + encodeURIComponent(playerName);

        }
        window.location.href = url;
    });

    var editProfileLink = document.getElementById("edit-profile-link");
    editProfileLink.addEventListener("click", function (e) {
        e.preventDefault();

        var url = "/memory/Main Menu/editprofile.html";

        if (playerId) {
            url += "?id=" + encodeURIComponent(playerId);
        }
        window.location.href = url;
    });

    var logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", function () {
        window.location.href = '../player.php?logout=true';
    })
});