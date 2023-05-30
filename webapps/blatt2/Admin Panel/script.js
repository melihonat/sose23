function changeTab(event) {
    event.preventDefault();
  
    // Alle Tabs in der Liste auswählen
    var tabs = document.querySelectorAll("#tabs ul li a");
  
    // Aktive Klasse für den ausgewählten Tab setzen
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove("active");
    }
    event.target.classList.add("active");
  
    // ID des ausgewählten Tabs ermitteln
    var tabId = event.target.getAttribute("href").substring(1);
  
    // Alle Tab-Inhalte auswählen und ausblenden
    var tabContents = document.querySelectorAll(".tab-content");
    for (var j = 0; j < tabContents.length; j++) {
      tabContents[j].style.display = "none";
    }
  
    // Ausgewählten Tab-Inhalt anzeigen
    document.getElementById(tabId).style.display = "block";

    if (tabId === "spieler") {
      // Bei Auswahl des "Spieler"-Tabs das "Spiele"-Tab verstecken
      document.getElementById("spiele-page").style.display = "none";
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    var tabs = document.querySelectorAll('#tabs ul li a');
    var tabContents = document.querySelectorAll('.tab-content');
    var spielerTable = document.getElementById('spieler').querySelector('table');
    var spielerRows = spielerTable.querySelectorAll('tr');
  
    // Spiele eines einzelnen Spielers
    var einzel_spielePage = document.getElementById('spiele-page');
    var einzel_spieleTable = einzel_spielePage.querySelector('#spiele-table');
  
    for (var i = 1; i < spielerRows.length; i++) {
      spielerRows[i].addEventListener('click', function(e) {
        e.preventDefault();
        var target = this.getAttribute('href');
  
        for (var j = 0; j < tabContents.length; j++) {
          tabContents[j].style.display = 'none';
        }
  
        document.querySelector(target).style.display = 'block';
  
      });
    }
  
    tabs[0].click(); // Standardmäßig ersten Tab anzeigen
  });
  