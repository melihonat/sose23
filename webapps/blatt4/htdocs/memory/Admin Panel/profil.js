function fetchPlayerData(playerId) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "../player.php?get_player_data=1&id=" + playerId, true);
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

function fetchPlayerGames(playerId, currentPage, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "../spiel.php?get_player_plays=1&id=" + playerId, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = xhr.responseText;
      var gameData = JSON.parse(response);
      if (callback) {
        callback(gameData, currentPage);
      }
    } else {
      console.error("Error fetching player games: " + xhr.status);
    }
  };
  xhr.onerror = function () {
    console.error("Network error");
  };
  xhr.send();
}

function displayPlayerGames(gameData, currentPage) {

  var gameTable = document.getElementById("spiel-table");
  var tbody = gameTable.getElementsByTagName("tbody")[0];
  tbody.innerHTML = "";

  var startIndex = (currentPage - 1) * gamesPerPage;
  var endIndex = startIndex + gamesPerPage;

  for (var i = startIndex; i < endIndex && i < gameData.length; i++) {
    var game = gameData[i];
    var row = document.createElement("tr");

    var spieltanCell = document.createElement("td");
    spieltanCell.textContent = game.spieltan;
    row.appendChild(spieltanCell);

    var levelCell = document.createElement("td");
    levelCell.textContent = game.level;
    row.appendChild(levelCell);    

    var dauerCell = document.createElement("td");
    dauerCell.textContent = game.dauer + " seconds";
    row.appendChild(dauerCell);  
    
    var spielartCell = document.createElement("td");
    spielartCell.textContent = game.spielart;
    row.appendChild(spielartCell);     

    var mitspielerCell = document.createElement("td");
    mitspielerCell.textContent = game.mitspieler ? game.mitspieler : "n/a";
    row.appendChild(mitspielerCell); 

    var gewinnerCell = document.createElement("td");
    gewinnerCell.textContent = game.gewinner ? game.gewinner : "n/a";
    row.appendChild(gewinnerCell);

    var verlaufCell = document.createElement("td");
    verlaufCell.textContent = game.verlauf;
    row.appendChild(verlaufCell); 

    tbody.appendChild(row);
  }
  displayPagination(gameData.length, currentPage);
}

function displayPagination(totalGames, currentPage) {
  var totalPages = Math.ceil(totalGames / gamesPerPage);

  var paginationContainer = document.getElementById("pagination");
  paginationHTML = "";

  if (currentPage > 1) {
    paginationHTML += '<button onclick="changePage(' + (currentPage - 1) + ')">Zurück</button>';
  }

  for (var i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      paginationHTML += '<button class="active">' + i + '</button>';
    } else {
      paginationHTML += '<button onclick="changePage(' + i + ')">' + i + '</button>';
    }
    paginationContainer.innerHTML = paginationHTML;
  }
}

function changePage(pageNumber) {
  currentPage = pageNumber;

  fetchPlayerGames(playerId, currentPage, function (gameData) {
    displayPlayerGames(gameData, currentPage);
  });
}

var playerId;
function decodePlayerNameFromURL() {
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var playerName = urlParams.get('name');
  playerId = urlParams.get('id');
  return { playerName: decodeURIComponent(playerName), playerId: playerId};
}

function convertDate(dateString) {
    var parts = dateString.split(" ");
    var datePart = parts[0];
    var timePart = parts[1];

    var dateParts = datePart.split("-");
    var year = parseInt(dateParts[0]);
    var month = parseInt(dateParts[1]) - 1; // Monate sind 0-based
    var day = parseInt(dateParts[2]);

    var timeParts = timePart.split(":");
    var hours = parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1]);
    var seconds = parseInt(timeParts[2]);

    return new Date(year, month, day, hours, minutes, seconds);
}
function sortByDate() {
    gameData.sort(function (a, b) {
      var dateA = convertDate(a.spieltan);
      var dateB = convertDate(b.spieltan);
      return sortDirectionDate === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
  
    var sortIndicatorLevel = document.querySelector("#sort-level-indicator");
    sortIndicatorLevel.textContent = ""; // Icon bei Level leeren
  
    var sortIndicatorDate = document.querySelector("#sort-date-indicator");
  
    if (sortDirectionDate === "asc") {
      sortIndicatorDate.textContent = "▲";
      sortDirectionDate = "desc";
    } else {
      sortIndicatorDate.textContent = "▼";
      sortDirectionDate = "asc";
    }
    currentPage = 1;
    displayPlayerGames(gameData, currentPage);
  }
  
  function sortByLevel() {
    gameData.sort(function (a,b) {
      var levelA = parseInt(a.level);
      var levelB = parseInt(b.level);
      return sortDirectionLevel ===  "asc" ? levelA - levelB : levelB - levelA;
    });
  
    var sortIndicatorDate = document.querySelector("#sort-date-indicator");
    sortIndicatorDate.textContent = ""; // Icon bei Spieldatum leeren
  
    var sortIndicatorLevel = document.querySelector("#sort-level-indicator");
  
    if (sortDirectionLevel === "asc") {
      sortIndicatorLevel.textContent = "▲";
      sortDirectionLevel = "desc";
    } else {
      gameData.reverse();
      sortIndicatorLevel.textContent = "▼";
      sortDirectionLevel = "asc";
    }
    currentPage = 1;
    displayPlayerGames(gameData, currentPage);
  }

  function calculateStatistics(gameData, playerId) {
    var gewonnen = 0;
    var verloren = 0;
    var abgebrochen = 0;
    var abgelaufen = 0;

    playerId = parseInt(playerId, 10);

    gameData.forEach(function(game) {
      var status = game.verlauf;
      if (status === "Beendet") {
        if (parseInt(game.gewinner, 10) === playerId) {
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

  function displayStatistics(gameData, playerId) {
    var statistics = calculateStatistics(gameData, playerId);

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
  
  var currentPage = 1;
  var gamesPerPage = 10;
  var gameData = [];
  var sortDirectionDate = "asc";
  var sortDirectionLevel = "asc";

  document.addEventListener('DOMContentLoaded', function() {
    // Spielernamen und ID aus der URL holen
    var { playerName, playerId } = decodePlayerNameFromURL();

    // Fetchen und anzeigen von Spielerdaten
    fetchPlayerData(playerId);

    //Fetchen und anzeigen von Spielen des Spielers
    fetchPlayerGames(playerId, 1, function(data, currentPage) {
      gameData = data;
      displayPlayerGames(gameData, 1);
      displayStatistics(gameData, playerId);
      displayPagination(gameData.length, 1);
    });    
    
    var sortDateButton = document.getElementById("sort-date-button");
    sortDateButton.addEventListener("click", function () {
      sortByDate();
    });
  
    var sortLevelButton = document.getElementById("sort-level-button");
    sortLevelButton.addEventListener("click", function () {
      sortByLevel();
    });   
  
    sortDateButton.click(); // Standardmäßig nach Datum sortieren
  });