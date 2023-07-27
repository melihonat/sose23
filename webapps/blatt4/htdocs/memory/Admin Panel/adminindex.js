function redirectToPlayerPage(playerName) {
  var url = 'spiel.html?name=' + playerName;
  window.location.href = url;
}

function changeTab(event) {
  event.preventDefault();

  // All Tabs in the list
  var tabs = document.querySelectorAll("#tabs ul li a");

  // Active class for the selected tab
  for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove("active");
  }
  event.target.classList.add("active");

  // ID of the selected tab
  var tabId = event.target.getAttribute("href").substring(1);

  // All Tab contents
  var tabContents = document.querySelectorAll(".tab-content");
  for (var j = 0; j < tabContents.length; j++) {
      tabContents[j].style.display = "none";
  }

  // Show the selected tab content
  document.getElementById(tabId).style.display = "block";

  if (tabId === "spieler") {
      // Fetch and display player data
      fetchPlayers();
  } else if (tabId === "spiel") {
    displayStatistics();
  } else if (tabId === "karte") {
    fetchExistingCards();
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
    var row = `<tr onclick="redirectToPlayerPage('${player.name}')">
                <td>${player.id}</td>
                <td>${player.name}</td>
                <td>${player.email}</td>
                <td>${player.level}</td>
              </tr>`;
    playersTBody.innerHTML += row;
  }
}

// Existierende Karten fetchen und anzeigen
function fetchExistingCards() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "../card.php?getCards=1", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = xhr.responseText;
      var cards = JSON.parse(response);
      displayExistingCards(cards);
    } else {
      console.error("Error fetching existing cards: " + xhr.status);
    }
  };
  xhr.onerror = function () {
    console.error("Network error");
  };
  xhr.send();
}

function displayExistingCards(cards) {
  var tableBody = document.getElementById("card-table-body");
  tableBody.innerHTML = "";

  cards.forEach(function (card) {
    // baseImageUrl und Dateiname zusammenführen
    var imageUrl = "../" + card.bild;
    var row = `
    <tr>
        <td><img src="${imageUrl}" width="150" height="200"></td>
        <td><button onclick="deleteCard(${card.id})">Delete</button></td>
    </tr>
    `;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
}

// Event listener für Form submission
document.getElementById("add-card-form").addEventListener("submit", function(event) {
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
      console.log(response); // Output success message from the server
      fetchExistingCards(); // Refresh the table to show the newly added card
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
      console.log(response);
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

document.addEventListener('DOMContentLoaded', function () {
  var tabs = document.querySelectorAll('#tabs ul li a');

  for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', changeTab);
  }

  tabs[0].click(); // Display the first tab by default
  fetchPlayers();
  fetchExistingCards();
});