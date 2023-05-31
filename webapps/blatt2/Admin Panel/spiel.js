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
  
  document.addEventListener('DOMContentLoaded', function() {
    var sortDateButton = document.getElementById("sort-date-button");
    sortDateButton.addEventListener("click", sortByDate);
  
    var sortLevelButton = document.getElementById("sort-level-button");
    sortLevelButton.addEventListener("click", sortByLevel);   
  
    sortDateButton.click(); // Standardmäßig nach Datum sortieren
  });
  