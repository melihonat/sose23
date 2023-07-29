function getQueryParameter(parameterName) {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    return urlParams.get(parameterName);
}

function startGame(level) {
    var playerName = getQueryParameter("name");
    var playerId = getQueryParameter("id");
    var selectedLevel = document.getElementById("levels").value;
    var selectedOption = levelSelect.options[levelSelect.selectedIndex];

    var anzahl_karten = selectedOption.dataset.anzahl_karten;
    var spielZeit = selectedOption.dataset.spielzeit;

    var url = "game.html?level=" + level;
    if (playerName) {
        url += "&name=" + encodeURIComponent(playerName);
    }
    if (playerId) {
        url += "&id=" + encodeURIComponent(playerId);
    }

    window.location.href = url;
}

var levelSelect;

document.addEventListener("DOMContentLoaded", function () {
    var levelForm = document.getElementById("level-form");
    levelSelect = document.getElementById("levels");
    fetchLevels();

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

    levelForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var selectedLevelId = levelSelect.value;

        // Zu game.html wechseln mit dem ausgewählten Level und playerName
        var playerName = getQueryParameter("name");
        window.location.href = `game.html?name=${encodeURIComponent(playerName)}&level=${encodeURIComponent(selectedLevelId)}`;
    });
});