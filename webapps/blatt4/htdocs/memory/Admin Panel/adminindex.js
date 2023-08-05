function redirectToPlayerPage(playerId, playerName) {
  var url = 'profil.html?id=' + playerId + '&name=' + encodeURIComponent(playerName);
  window.location.href = url;
}

function changeTab(event) {
  event.preventDefault();

  // Alle Tabs in der Liste
  var tabs = document.querySelectorAll("#tabs ul li a");

  // Active Klasse für den momentanen Tab
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }
  event.target.classList.add("active");

  // ID des ausgewählten Tabs
  var tabId = event.target.getAttribute("href").substring(1);

  // Alle Tabinhalte
  var tabContents = document.querySelectorAll(".tab-content");
  for (var j = 0; j < tabContents.length; j++) {
    tabContents[j].style.display = "none";
  }

  // Zeige den gewählten Tab
  document.getElementById(tabId).style.display = "block";

  if (tabId === "spieler") {
    fetchPlayers();
  } else if (tabId === "spiel") {
    fetchGames();
  } else if (tabId === "karte") {
    fetchExistingCards();
  } else if (tabId === "level") {
    fetchExistingLevels();
  }
}

function fetchPlayers() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "../player.php?get_players=1", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = xhr.responseText;
      var players = JSON.parse(response);
      displayPlayers(players);
    } else {
      console.error("Error fetching players: " + xhr.status);
    }
  };
  xhr.onerror = function () {
    console.error("Network error");
  };
  xhr.send();
}

function displayPlayers(players) {
  var playersTable = document.getElementById("players-table");
  var playersTBody = playersTable.getElementsByTagName("tbody")[0];
  playersTBody.innerHTML = "";

  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    var row = `<tr onclick="redirectToPlayerPage(${player.id}, '${player.name}')">
                <td>${player.id}</td>
                <td>${player.name}</td>
                <td>${player.email}</td>
                <td>${player.level}</td>
              </tr>`;
    playersTBody.innerHTML += row;
  }
}

function fetchGames(playerId = null) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "../spiel.php?get_all_games=1", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = xhr.responseText;
      var games = JSON.parse(response);
      displayGames(games);
    } else {
      console.error("Error fetching game data: " + xhr.status);
    }
  };
  xhr.onerror = function () {
    console.error("Network error");
  };
  xhr.send();
}

function displayGames(games) {
  console.log("received games: ", games);

  var tableBody = document.querySelector("#tableBody");
  if (!tableBody) {
    console.error("Table body element not found.");
    return;
  }

  tableBody.innerHTML = "";

  for (var i = 0; i < games.length; i++) {
    var game = games[i];
    console.log("Current game: ", game);

    var gameType = game.hasOwnProperty('einzeln') ? (game.einzeln ? "Single" : "Double") : "n/a";

    var row = `
      <tr>
        <td>${game.spieltan}</td>
        <td>${game.level}</td>
        <td>${game.dauer}</td>
        <td>${gameType}</td>
        <td>${game.initiator}, ${game.mitspieler}</td>
        <td>${game.gewinner ? game.gewinner : "n/a"}</td>
        <td>${game.verlauf}</td>
      </tr>
    `;
    tableBody.insertAdjacentHTML("beforeend", row);
  }
}

// Existierende Karten fetchen und anzeigen
var currentPage = 1;
var cardsPerPage = 3;
var totalCards = 0;
var cards = [];

function fetchExistingCards() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "../card.php?getCards=1", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      totalCards = response.length;
      cards = response;
      displayExistingCards();
    } else {
      console.error("Error fetching existing cards: " + xhr.status);
    }
  };
  xhr.onerror = function () {
    console.error("Network error");
  };
  xhr.send();
}

function displayExistingCards() {
  var tableBody = document.getElementById("card-table-body");
  tableBody.innerHTML = "";

  var startIndex = (currentPage - 1) * cardsPerPage;
  var endIndex = startIndex + cardsPerPage;
  var paginatedCards = cards.slice(startIndex, endIndex);

  paginatedCards.forEach(function (card) {
    var imageUrl = "../" + card.bild;
    var row = `
      <tr>
        <td><img src="${imageUrl}" width="150" height="200"></td>
        <td><button onclick="deleteCard(${card.id})">Delete</button></td>
      </tr>
    `;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
  updatePaginationButton();
}

function updatePaginationButton() {
  var prevPageBtn = document.getElementById("prev-page-btn");
  var nextPageBtn = document.getElementById("next-page-btn");

  var totalPages = Math.ceil(totalCards / cardsPerPage);

  // Previous und Next Button entfernen oder hinzufügen je nach currentPage

  if (currentPage === 1) {
    prevPageBtn.disabled = true;
  } else {
    prevPageBtn.disabled = false;
  }

  if (currentPage === totalPages) {
    nextPageBtn.disabled = true;
  } else {
    nextPageBtn.disabled = false;
  }
}

function goToPreviousPage() {
  if (currentPage > 1) {
    currentPage--;
    updatePaginationButton();
    displayExistingCards(cards);
  }
}

function goToNextPage() {
  var totalPages = Math.ceil(totalCards / cardsPerPage);

  if (currentPage < totalPages) {
    currentPage++;
    updatePaginationButton();
    displayExistingCards(cards);
  }
}

// Event listeners für die Pagination buttons
document.getElementById("prev-page-btn").addEventListener("click", goToPreviousPage);
document.getElementById("next-page-btn").addEventListener("click", goToNextPage);

// Event listener für Form submission im Karte tab
document.getElementById("add-card-form").addEventListener("submit", function (event) {
  event.preventDefault();

  var formData = new FormData(event.target);
  addNewCard(formData);
});

// Funktion zum Hinzufügen einer neuen Karte
function addNewCard(formData) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "../card.php", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = xhr.responseText;
      fetchExistingCards(); // Tabelle refreshen
    } else {
      console.error("Error adding new card: " + xhr.status);
    }
  };
  xhr.onerror = function () {
    console.error("Network error");
  };
  xhr.send(formData);
}

// Funktion zum Löschen einer existierenden Karte
function deleteCard(cardId) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "../card.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = xhr.responseText;
      fetchExistingCards(); // Tabelle refreshen
    } else {
      console.error("Error deleting card: " + xhr.status);
    }
  };
  xhr.onerror = function () {
    console.error("Network error");
  };
  xhr.send("deleteCardId=" + cardId);
}

// Event listener für Form submission im Level tab
document.getElementById("add-level-form").addEventListener("submit", function (event) {
  event.preventDefault();

  var formData = new FormData(event.target);
  addNewLevel(formData);
});

// Existierende Level fetchen und anzeigen
function fetchExistingLevels() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "../level.php?getLevels=1", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = xhr.responseText;
      var levels = JSON.parse(response);
      displayExistingLevels(levels);
    } else {
      console.error("Error fetching existing levels: " + xhr.status);
    }
  };
  xhr.onerror = function () {
    console.error("Network error");
  };
  xhr.send();
}

function displayExistingLevels(levels) {
  var tableBody = document.getElementById("level-table-body");
  tableBody.innerHTML = "";

  levels.forEach(function (level) {
    var row = `
      <tr>
        <td>${level.level}</td>
        <td>${level.anzahl_karten}</td>
        <td>${level.spielZeit}</td>
        <td><button onclick="deleteLevel(${level.id})">Delete</button></td>
      </tr>
    `;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
}

function addNewLevel(formData) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "../level.php", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = xhr.responseText;
      fetchExistingLevels();
    } else {
      console.error("Error adding new level: " + xhr.status);
    }
  };
  xhr.onerror = function () {
    console.error("Network error");
  };
  xhr.send(formData);
}

function deleteLevel(levelId) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "../level.php", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = xhr.responseText;
      fetchExistingLevels();
    } else {
      console.error("Error deleting level: " + xhr.status);
    }
  };
  xhr.onerror = function () {
    console.error("Network error");
  };
  xhr.send("deleteLevelId=" + levelId);
}

document.addEventListener('DOMContentLoaded', function () {
  var tabs = document.querySelectorAll('#tabs ul li a');

  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', changeTab);
  }

  tabs[0].click(); // Standardmäßig ersten Tab anzeigen
  fetchPlayers();
  fetchExistingCards();
  fetchExistingLevels();
});