function fetchPlayerData(playerName) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "../player.php?get_player_data=1&name=" + playerName, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = xhr.responseText;
      var playerData = JSON.parse(response);
      displayPlayerData(playerData);
    } else {
      console.error("Error fetching player data: " + xhr.status);
    }
  };
  xhr.onerror = function () {
    console.error("Network error");
  };
  xhr.send();
}

// Funktion zum Displayen von Spielerdaten
function displayPlayerData(playerData) {
  var playerNameElement = document.getElementById("spieler-titel");
  playerNameElement.innerText = "Spielerdaten von " + playerData.name;

  var playerNameTable = document.getElementById("player-name");
  playerNameTable.innerText = playerData.name;

  var displayDataTable = document.getElementById("player-data-table");
  displayDataTable.innerHTML = `
    <tr>
      <td>ID</td>
      <td>${playerData.id}</td>
    </tr>
    <tr>
      <td>Name</td>
      <td>${playerData.name}</td>
    </tr>  
    <tr>
      <td>E-Mail</td>
      <td>${playerData.email}</td>
    </tr>
    <tr>
      <td>Spiellevel</td>
      <td>${playerData.level}</td>
    </tr>  
  `;
}

function decodePlayerNameFromURL() {
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var playerName = urlParams.get('name');
  return decodeURIComponent(playerName);
}

function convertDate(dateString) {
    var parts = dateString.split(".");
    var day = parseInt(parts[0]);
    var month = parseInt(parts[1]) - 1; // -1 weil Monate im Javascript Datum bei 0 beginnen
    var year = parseInt(parts[2]);
    return new Date(year, month, day);
}
function sortByDate() {
    var table = document.querySelector("#spiel-table");
    var rows = Array.from(table.querySelectorAll("tbody tr"));
  
    rows.sort(function(a, b) {
      var dateA = convertDate(a.cells[0].innerText);
      var dateB = convertDate(b.cells[0].innerText);
      return dateA.getTime() - dateB.getTime();
    });
  
    var sortIndicatorLevel = document.querySelector("#sort-level-indicator");
    sortIndicatorLevel.textContent = ""; // Icon bei Level leeren
  
    var sortIndicatorDate = document.querySelector("#sort-date-indicator");
    var sortDirection = sortIndicatorDate.dataset.sortDirection || "asc";
  
    if (sortDirection === "asc") {
      rows.forEach(function(row) {
        table.querySelector("tbody").appendChild(row);
      });
      sortIndicatorDate.textContent = "▲";
      sortIndicatorDate.dataset.sortDirection = "desc";
    } else {
      rows.reverse();
      rows.forEach(function(row) {
        table.querySelector("tbody").appendChild(row);
      });
      sortIndicatorDate.textContent = "▼";
      sortIndicatorDate.dataset.sortDirection = "asc";
    }
  }
  
  function sortByLevel() {
    var table = document.querySelector("#spiel-table");
    var rows = Array.from(table.querySelectorAll("tbody tr"));
  
    rows.sort(function(a, b) {
      var levelA = parseInt(a.cells[1].innerText);
      var levelB = parseInt(b.cells[1].innerText);
      return levelA - levelB;
    });
  
    var sortIndicatorDate = document.querySelector("#sort-date-indicator");
    sortIndicatorDate.textContent = ""; // Icon bei Spieldatum leeren
  
    var sortIndicatorLevel = document.querySelector("#sort-level-indicator");
    var sortDirection = sortIndicatorLevel.dataset.sortDirection || "asc";
  
    if (sortDirection === "asc") {
      rows.forEach(function(row) {
        table.querySelector("tbody").appendChild(row);
      });
      sortIndicatorLevel.textContent = "▲";
      sortIndicatorLevel.dataset.sortDirection = "desc";
    } else {
      rows.reverse();
      rows.forEach(function(row) {
        table.querySelector("tbody").appendChild(row);
      });
      sortIndicatorLevel.textContent = "▼";
      sortIndicatorLevel.dataset.sortDirection = "asc";
    }
  }

  function calculateStatistics() {
    var table = document.querySelector("#spiel-table");
    var rows = table.querySelectorAll("tbody tr");

    var gewonnen = 0;
    var verloren = 0;
    var abgebrochen = 0;
    var abgelaufen = 0;

    rows.forEach(function(row) {
      var status = row.cells[6].innerText;
      if (status === "Beendet") {
        var gewinner = row.cells[5].innerText;
        if (gewinner === "Dontax") {
          gewonnen++;
        } else {
          verloren++;
        }
      } else if (status === "Abgebrochen") {
        abgebrochen++;
      } else if (status === "Abgelaufen") {
        abgelaufen++;
      }
    });

    return {
      gewonnen: gewonnen,
      verloren: verloren,
      abgebrochen: abgebrochen,
      abgelaufen: abgelaufen
    };
  }

  function displayStatistics() {
    var statistics = calculateStatistics();

    var chartCanvas = document.getElementById("chart");
    var chartData =  {
      labels: ["Gewonnen", "Verloren", "Abgebrochen", "Abgelaufen"],
      datasets: [
        {
          label: "Statistiken",
          data: [
            statistics.gewonnen,
            statistics.verloren,
            statistics.abgebrochen,
            statistics.abgelaufen
          ],
          backgroundColor: [
            "green",
            "red",
            "orange",
            "yellow"
          ]
        }
      ]
    };

    new Chart(chartCanvas, {
      type: "doughnut",
      data: chartData
    });
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    // Spielernamen aus der URL holen
    var playerName = decodePlayerNameFromURL();
    // Fetchen und anzeigen von Spielerdaten
    fetchPlayerData(playerName);
    
    
    var sortDateButton = document.getElementById("sort-date-button");
    sortDateButton.addEventListener("click", sortByDate);
  
    var sortLevelButton = document.getElementById("sort-level-button");
    sortLevelButton.addEventListener("click", sortByLevel);   
  
    sortDateButton.click(); // Standardmäßig nach Datum sortieren

    displayStatistics();
  });
  