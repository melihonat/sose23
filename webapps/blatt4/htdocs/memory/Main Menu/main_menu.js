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

    var invitePlayerLink = document.getElementById("invite-player-link");
    invitePlayerLink.addEventListener("click", function (e) {
        e.preventDefault();
        var playerId = getQueryParameter('id');
        var playerName = getQueryParameter('name');
        fetchPlayerData(playerId, playerName);
    })

    function fetchPlayerData(playerId, playerName) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "../player.php?get_player_data=1&id=" + playerId, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                var playerLevel = response.level;

                var url = "invite_page.html?id=" + encodeURIComponent(playerId) + "&name=" + encodeURIComponent(playerName) + "&level=" + encodeURIComponent(playerLevel);
                window.location.href = url;
            } else {
                console.error("Error fetching player data: " + xhr.status);
            }
        };
        xhr.onerror = function () {
            console.error("Network error");
        };
        xhr.send();
    }

    var editProfileLink = document.getElementById("edit-profile-link");
    editProfileLink.addEventListener("click", function (e) {
        e.preventDefault();

        var url = "editprofile.html";

        if (playerId) {
            url += "?id=" + encodeURIComponent(playerId);
        }
        window.location.href = url;
    });

    var logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", function () {
        window.location.href = '../player.php?logout=true';
    });

    // Alle 5 Sekunden nach Einladung checken
    setInterval(checkForInvites, 5000);
});

var playerId = getQueryParameter('id');
var playerName = getQueryParameter('name');
function checkForInvites() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../player.php?check_invite_for=" + playerId, true);
    xhr.onload = function () {
        var response = JSON.parse(xhr.responseText);
        if (response.status === 'success') {
            if (confirm(response.inviterName + " hat dich zu einem Spiel eingeladen! Nimmst du an?")) {
                // Einladung angenommen
                acceptInvite(response.inviterId, response.inviterName);
            } else {
                // Einladung abgelehnt
                declineInvite(response.inviterId, response.inviterName);
            }
        } else if (response.status === 'no_invites') {
            // Keine Einladungen gefunden, nichts machen
        } else {
            console.error("Error checking for invites");
        }
    };
    xhr.onerror = function () {
        console.error("Network error while checking for invites");
    };
    xhr.send();
}

function acceptInvite(inviterId, inviterName) {
    // Invitation status auf dem Server updaten
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../player.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
        var response = JSON.parse(xhr.responseText);
        if (response.status === 'success' && response.action === 'accepted') {
            // Redirect zur Level Selection
            window.location.href = "../Game/multiplayer_level_selection.html?inviterId=" + inviterId +
                                    "&inviterName=" + encodeURIComponent(inviterName) + 
                                    "&inviteeId=" + playerId + 
                                    "&inviteeName=" + encodeURIComponent(playerName);
        }
    };
    xhr.onerror = function () {
        console.error("Network error");
    };
    var postData = "action=accept_invite&inviter_id=" + inviterId + "&invitee_id=" + playerId;
    console.log(postData);
    xhr.send(postData);
}

function declineInvite(inviterId, inviterName) {
    // Invitation status auf dem Server updaten
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../player.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
        var response = JSON.parse(xhr.responseText);
        if (response.status === 'success' && response.action === 'declined') {
            // Auf dem Main Menü bleiben
            alert("Einladung abgelehnt");
        }
    };
    xhr.onerror = function () {
        console.error("Network error");
    };
    var postData = "action=decline_invite&inviter_id=" + inviterId + "&invitee_id=" + playerId;
    console.log(postData);
    xhr.send(postData);
}