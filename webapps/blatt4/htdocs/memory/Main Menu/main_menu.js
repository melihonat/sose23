// Funktion um Query-Parameter aus der URL zu lesen (z.B. ID)
function getQueryParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]'); // JS String Methode, um eckige Klammern durch Backslashes zu maskieren (um Sonderzeichen richtig zu kodieren)
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'); // Diese line soll einen bestimmten Query-Parameter in der URL abgleichen
    var results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' ')); // Erzeugt von Menschen lesbaren String
}

// Welcome Nachricht, sodass der playerName angezeigt wird
var playerName = getQueryParameter('name');
document.getElementById('player-name').textContent = playerName;

document.addEventListener("DOMContentLoaded", function () {
    var profileLink = document.getElementById("profile-link");
    profileLink.href = "../Admin Panel/spiel.html?name=" + encodeURIComponent(playerName);
});