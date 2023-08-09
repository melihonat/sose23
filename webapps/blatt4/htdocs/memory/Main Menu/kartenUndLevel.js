function getQueryParameter(parameterName) {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    return urlParams.get(parameterName);
}

var playerId = getQueryParameter('id');
var playerName = getQueryParameter('name');

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
  
    if (tabId === "karte") {
      fetchExistingCards();
    } else if (tabId === "level") {
      fetchExistingLevels();
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
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
}

var backButtonLink = document.getElementById("back-button");
backButtonLink.addEventListener("click", function () {
    window.location.href = "main_menu.html?id=" + encodeURIComponent(playerId) + "&name=" + encodeURIComponent(playerName);
});

document.addEventListener('DOMContentLoaded', function () {
    var tabs = document.querySelectorAll('#tabs ul li a');
  
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', changeTab);
    }
  
    tabs[0].click(); // Standardmäßig ersten Tab anzeigen
    fetchExistingCards();
    fetchExistingLevels();
});