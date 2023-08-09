function getQueryParameter(parameterName) {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    return urlParams.get(parameterName);
}

function startMultiplayerGame(level) {
    var invitationId = getQueryParameter('invitationId');
    var inviterName = getQueryParameter("inviterName");
    var inviterId = getQueryParameter("inviterId");
    var inviteeName = getQueryParameter("inviteeName");
    var inviteeId = getQueryParameter("inviteeId");


    fetch(`../spiel.php?startGame=true&invitationId=${invitationId}&selectedLevel=${level}`, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                var url = "multiplayer_game.html?level=" + level;
                url += "&inviterId=" + encodeURIComponent(inviterId) + "&inviterName=" + encodeURIComponent(inviterName);
                url += "&inviteeId=" + encodeURIComponent(inviteeId) + "&inviteeName=" + encodeURIComponent(inviteeName);

                window.location.href = url;
            } else {
                console.error("Fehler beim Starten des Spiels: ", error);
            }
        })
        .catch(error => {
            console.error("Fehler beim Starten des Spiels: ", error);
        });
}

function getCurrentPlayerRole() {
    return getQueryParameter("currentPlayerRole");
}

function checkIfGameStarted() {
    var invitationId = getQueryParameter("invitationId");
    fetch(`../spiel.php?hasGameStarted=true&invitationId=${invitationId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.gameStarted) {
                startMultiplayerGame(data.selectedLevel);
            } else {
                setTimeout(checkIfGameStarted, 5000);
            }
        })
        .catch(error => {
            console.error("Fehler beim checken des Spielstatus: ", error);
        });
}

var levelSelect;

document.addEventListener("DOMContentLoaded", function () {
    levelSelect = document.getElementById("levels");
    var startGameButton = document.getElementById("startGameButton");
    fetchLevels();

    var currentPlayerRole = getCurrentPlayerRole();

    if (currentPlayerRole === "invitee") {
        levelSelect.disabled = true;
        startGameButton.disabled = true;
        checkIfGameStarted();
    } else if (currentPlayerRole === "inviter") {
        // Inviter darf Level aussuchen
        startGameButton.addEventListener('click', function () {
            startMultiplayerGame(levelSelect.value);
        });
    } else {
        console.error("Unerwartete Spielerrolle!");
    }

    function fetchLevels() {
        // AJAX request zum Server um die Levels zu erkennen
        fetch("../level.php?getLevels=true")
            .then((response) => response.json())
            .then((data) => {
                populateLevelOptions(data);
            })
            .catch((error) => {
                console.error("Error fetching levels: ", error);
            });
    }

    function populateLevelOptions(levels) {
        // Existierende Optionen clearen
        levelSelect.innerHTML = "";

        // Für jedes Level eine Option im Select Element einfügen
        levels.forEach((level) => {
            var option = document.createElement("option");
            option.value = level.level;
            option.text = level.level;
            levelSelect.appendChild(option);
        });
    }
});