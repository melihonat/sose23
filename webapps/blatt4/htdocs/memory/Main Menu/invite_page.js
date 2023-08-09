document.addEventListener("DOMContentLoaded", function () {
    fetchPlayersOnSameLevel();
})

function getQueryParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

var playerId = getQueryParameter('id');
var playerName = getQueryParameter('name');
var playerLevel = getQueryParameter('level');

document.getElementById('player-name').textContent = playerName;

function fetchPlayersOnSameLevel(playerLevel) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../player.php?get_players_on_same_level=1&level=" + playerLevel, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = xhr.responseText;
            var players = JSON.parse(response)
            displayPlayersOnSameLevel(players);
        } else {
            console.error("Error fetching players: " + xhr.status);
        }
    };
    xhr.onerror = function () {
        console.error("Network error");
    };
    xhr.send();
}

// Spieler auf gleichem Level anzeigen
function displayPlayersOnSameLevel(players) {
    var tableBody = document.querySelector("#invite-table tbody");
    if (!tableBody) {
        console.error("Table body element not found.");
    }
    tableBody.innerHTML = "";

    for (var i = 0; i < players.length; i++) {
        var player = players[i];

        var row = `
            <tr>
                <td>${player.id}</td>
                <td>${player.name}</td>
                <td>${player.email}</td>
                <td>${player.level}</td>
                <td><button class="invite-button" data-name="${player.name}">Einladen</button></td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
    }
    var inviteButtons = document.querySelectorAll(".invite-button");
    for (var j = 0; j < inviteButtons.length; j++) {
        inviteButtons[j].addEventListener("click", function(event) {
            var playerNameToInvite = event.target.dataset.name;
            var inviteeId = event.target.closest('tr').children[0].textContent;
            sendInvitation(inviteeId);
            alert("Du hast " + playerNameToInvite + " zu einem Spiel eingeladen!");
        });
    }
}

function sendInvitation(inviteeId) {
    console.log("Sending invite from", playerId, "to", inviteeId);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../player.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
        var response = JSON.parse(xhr.responseText);
        if (response.status === 'success') {
            // Alert wird schon in displayPlayersOnSameLevel() geschickt
        } else {
            alert (response.message || "Fehler beim Senden der Einladung.");
        }
    };
    xhr.onerror = function () {
        console.error("Network error");
    };
    var postData = "action=send_invite&inviter_id=" + playerId + "&invitee_id=" + inviteeId;
    xhr.send(postData);
}

var backButtonLink = document.getElementById("back-button");
backButtonLink.addEventListener("click", function () {
    window.location.href = "/memory/Main Menu/main_menu.html?id=" + encodeURIComponent(playerId) + "&name=" + encodeURIComponent(playerName);
});

var checkInviteStatusInterval = setInterval(checkInviteStatus, 5000);

function checkInviteStatus() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../player.php?check_invite_status_for=" + playerId, true);
    xhr.onload = function () {
        var response = JSON.parse(xhr.responseText);
        if (response.status === 'ACCEPTED') {
            // Redirect zur level selection page
            clearInterval(checkInviteStatusInterval);
            var url = "../Game/multiplayer_level_selection.html?inviterId=" + playerId + 
                      "&InviterName=" + encodeURIComponent(playerName) + 
                      "&inviteeId=" + response.inviteeId + 
                      "&inviteeName=" + encodeURIComponent(response.inviteeName) +
                      "&currentPlayerRole=inviter" +
                      "&invitationId=" + response.invitationId;
            window.location.href = url;
        } else if (response.status === 'REJECTED') {
            alert('Dein gewünschter Gegner hat deine Einladung abgelehnt.');
            clearInterval(checkInviteStatusInterval);
        }
    };
    xhr.onerror = function () {
        console.error("Network error while checking invite status");
    }
    xhr.send();
}