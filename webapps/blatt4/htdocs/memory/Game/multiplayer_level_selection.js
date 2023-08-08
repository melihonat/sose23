 function getQueryParameter(parameterName) {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    return urlParams.get(parameterName);
 }

 function startMultiplayerGame(level) {
    var inviterName = getQueryParameter("inviterName");
    var inviterId = getQueryParameter("inviterId");
    var inviteeName = getQueryParameter("inviteeName");
    var inviteeId = getQueryParameter("inviteeId");

    var url = "multiplayer_game.html?level=" + level;
    url += "&inviterId=" + encodeURIComponent(inviterId) + "&inviterName=" + encodeURIComponent(inviterName);
    url += "&inviteeId=" + encodeURIComponent(inviteeId) + "&inviteeName=" + encodeURIComponent(inviteeName);

    window.location.href = url;
 }

var levelSelect;

document.addEventListener("DOMContentLoaded", function () {
    var levelForm = document.getElementById("level-form");
    levelSelect = document.getElementById("levels");
    fetchLevels();

    var currentPlayerId = getQueryParameter("inviterId") || getQueryParameter("inviteeId");
    var currentPlayerRole = getQueryParameter("inviterId") ? "inviter" : "invitee";

    if (currentPlayerRole === "invitee") {
        levelSelect.disabled = true;
        document.querySelector("button[type='button']").disabled = true;
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