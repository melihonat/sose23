function getQueryParameter(parameterName) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(parameterName);
}

document.addEventListener('DOMContentLoaded', () => {

  var playerId = getQueryParameter('id');
  var playerName = getQueryParameter('name');
  var level = getQueryParameter('level');

  const cardBack = 'card-back.png';

  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;

  let moves = 0;
  let matchedPairs = 0;

  let startTime, endTime, timerInterval;
  let gameTimeRemaining = 0;
  var spieltanFormatted = '';

  const memoryBoard = document.querySelector('.memory-board');
  const timerElement = document.getElementById('timer');
  const winnerScreen = document.getElementById('winner-screen');

  let winnerScreenShown = false;

  let anzahl_karten = 0;
  let spielZeit = 0;

  const cardImages = [];

  fetch(`../level.php?getLevels=true`)
    .then((response) => response.json())
    .then((data) => {
      selectedLevel = data.find((item) => item.level === level);
      if (selectedLevel) {
        anzahl_karten = selectedLevel.anzahl_karten;
        spielZeit = selectedLevel.spielZeit;
        // endTime berechnen
        startTime = new Date().getTime();
        endTime = startTime + spielZeit * 1000;

        // Array für Karten erstellen (Achtung: Karten müssen nummeriert sein! z.B. 1.png, 2.png, 3.png ...)
        for (let i = 1; i <= anzahl_karten / 2; i++) {
          cardImages.push(`${i}.png`);
          cardImages.push(`${i}.png`);
        }
        // Karten shufflen
        cardImages.sort(() => 0.5 - Math.random());

        // Kartenelemente hinzufügen
        cardImages.forEach(image => {
          const cardElement = document.createElement('div');
          cardElement.classList.add('memory-card');
          cardElement.innerHTML = `
            <img class="front-face" src="${cardBack}" alt="Card Back">
            <img class="back-face" src="../Kartenbilder/${image}" alt="Card">
          `;
          cardElement.addEventListener('click', flipCard);
          memoryBoard.appendChild(cardElement);
        });
      } else {
        console.error('Level ${level} not found.');
      }
    })
    .catch((error) => {
      console.error("Error fetching levels: ", error);
    });

  // Karte umdrehen
  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    checkForMatch();
  }

  // Gleiche Karte aufgedeckt?
  function checkForMatch() {
    let isMatch = firstCard.querySelector('.back-face').src === secondCard.querySelector('.back-face').src;

    isMatch ? disableCards() : unflipCards();
    incrementMoves();
  }

  // Wenn gleiche Karten aufgedeckt, diese entfernen
  function disableCards() {
    lockBoard = true;

    setTimeout(() => {
      firstCard.style.visibility = 'hidden';
      secondCard.style.visibility = 'hidden';

      matchedPairs++;

      if (matchedPairs === cardImages.length / 2) {
        // Alle paare wurden gefunden
        endGame();
      }

      resetBoard();
    }, 1000); // Kurzer Delay bevor dem Löschen der Karten
  }

  // Ungleiche Karten gefunden, also wieder umdrehen
  function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');

      resetBoard();
    }, 1000);
  }

  // Board reset
  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  // Moves counter
  function incrementMoves() {
    moves++;
  }

  // Timer starten
  startTime = new Date().getTime();
  endTime = startTime + spielZeit * 1000;

  function updateTimer() {
    const currentTime = new Date().getTime();
    gameTimeRemaining = Math.max(0, endTime - currentTime);

    const minutes = Math.floor(gameTimeRemaining / 60000);
    const seconds = Math.floor((gameTimeRemaining % 60000) / 1000);

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerElement.textContent = `Time Left: ${formattedTime}`;

    // Checken ob der Timer ausgelaufen ist und der Winnerscreen nicht gezeigt wird
    if (currentTime >= endTime) {
      clearInterval(timerInterval);
      timerElement.textContent = 'Zeit ist um!';
      document.getElementById("cancel-button").style.display = "none";
      document.getElementById("back-to-menu-button").style.display = "block";
      endGame();
    }
  }
  timerInterval = setInterval(updateTimer, 1000);

  document.getElementById("back-to-menu-button").addEventListener("click", function () {
    var url = '../Main Menu/main_menu.html';
    if (playerId) {
      url += '?id=' + encodeURIComponent(playerId);
    }

    if (playerName) {
      url += '&name=' + encodeURIComponent(playerName);
    }

    window.location.href = url;
  });

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function endGame() {
    const currentTime = new Date().toISOString();

    let verlauf;

    if (matchedPairs === cardImages.length / 2) {
      verlauf = 'Beendet';
      if (!winnerScreenShown) {
        stopTimer();
        const xpReward = getXpReward(level);
        updatePlayerXpAndLevel(playerId, xpReward);
        showWinnerScreen();
        winnerScreenShown = true;
      }
    } else if (gameTimeRemaining <= 0) {
      verlauf = 'Abgelaufen';
    } else {
      verlauf = 'Abgebrochen';
    }

    // Datetime Formatierung
    const spieltanDate = new Date(startTime);
    const spieltanYear = spieltanDate.getFullYear();
    const spieltanMonth = String(spieltanDate.getMonth() + 1).padStart(2, '0');
    const spieltanDay = String(spieltanDate.getDate()).padStart(2, '0');
    const spieltanHours = String(spieltanDate.getHours()).padStart(2, '0');
    const spieltanMinutes = String(spieltanDate.getMinutes()).padStart(2, '0');
    const spieltanSeconds = String(spieltanDate.getSeconds()).padStart(2, '0');
    spieltanFormatted = `${spieltanYear}-${spieltanMonth}-${spieltanDay} ${spieltanHours}:${spieltanMinutes}:${spieltanSeconds}`;

    const gameResults = {
      einzeln: true, // only solo gamemode so far
      spieltan: spieltanFormatted,
      level: level,
      dauer: matchedPairs === cardImages.length / 2 ? Math.floor((new Date().getTime() - startTime) / 1000) : spielZeit, // Spielzeitberechnung wenn der Solospieler gewonnen hat
      verlauf: verlauf,
      gewinner: matchedPairs === cardImages.length / 2 ? playerId : null, // Solo player ID wenn der Spieler gewonnen hat, ansonsten null
      initiator: playerId,
      mitspieler: null
    };
    sendGameResultsToServer(gameResults);

    // Winner screen zeigen wenn der Spieler gewinnt
    if (matchedPairs === cardImages.length / 2 && !winnerScreenShown) {
      stopTimer();
      showWinnerScreen();
      winnerScreenShown = true;
    }
  }

  function sendGameResultsToServer(gameResults) {
    fetch('../spiel.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gameResults)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Server response: ', data);
      })
      .catch(error => {
        console.error('Error sending game results to the server: ', error);
      });
  }

  function showWinnerScreen() {
    if (winnerScreen) {
      const winnerMessage = document.getElementById('winner-name');
      winnerMessage.textContent = playerName;
      winnerScreen.style.display = 'block';

      let mainMenuButton = document.createElement('button');
      mainMenuButton.innerText = 'Zurück zum Hauptmenü';

      mainMenuButton.addEventListener('click', () => {
        var url = '../Main Menu/main_menu.html';
        if (playerId) {
          url += '?id=' + encodeURIComponent(playerId);
        }

        if (playerName) {
          url += '&name=' + encodeURIComponent(playerName);
        }

        window.location.href = url;
      });

      document.getElementById('winner-screen').append(mainMenuButton);
    }
  }

  // Spiel abbrechen (Button)
  const cancelGameButton = document.getElementById('cancel-button');
  if (cancelGameButton) {
    cancelGameButton.addEventListener('click', handleCancelGame);
  }

  function handleCancelGame() {
    const spieltanDate = new Date(startTime);
    const spieltanYear = spieltanDate.getFullYear();
    const spieltanMonth = String(spieltanDate.getMonth() + 1).padStart(2, '0');
    const spieltanDay = String(spieltanDate.getDate()).padStart(2, '0');
    const spieltanHours = String(spieltanDate.getHours()).padStart(2, '0');
    const spieltanMinutes = String(spieltanDate.getMinutes()).padStart(2, '0');
    const spieltanSeconds = String(spieltanDate.getSeconds()).padStart(2, '0');
    spieltanFormatted = `${spieltanYear}-${spieltanMonth}-${spieltanDay} ${spieltanHours}:${spieltanMinutes}:${spieltanSeconds}`;

    const confirmCancel = window.confirm('Bist du dir sicher, dass du das Spiel abbrechen möchtest?');
    if (confirmCancel) {
      stopTimer();

      gameResults = {
        einzeln: true, // only solo gamemode so far
        spieltan: spieltanFormatted,
        level: level,
        dauer: Math.floor((new Date().getTime() - startTime) / 1000),
        verlauf: 'Abgebrochen',
        gewinner: null,
        initiator: playerId,
        mitspieler: null
      };

      sendGameResultsToServer(gameResults);
      var url = '../Main Menu/main_menu.html';
      if (playerId) {
        url += '?id=' + encodeURIComponent(playerId);
      }

      if (playerName) {
        url += '&name=' + encodeURIComponent(playerName);
      }

      window.location.href = url;
    }
  }

  function getXpReward(gameLevel) {
    return gameLevel * 10;
  }

  function updatePlayerXpAndLevel(playerId, xpReward) {
    fetch(`../player.php?updatePlayerXp&id=${playerId}&xp=${xpReward}`)
      .then(response => response.text())
      .then(text => {

        try {
          return JSON.parse(text);
        } catch (e) {
          console.error('Parsing error:', e);
        }
      })

      .then(data => {
        console.log('Player XP and level updated:', data);
        let newLevel = data.level;
        let levelUpMessageElement = document.createElement('p');
        if (data.hasLeveledUp) {
          levelUpMessageElement.textContent = `Du bist aufgestiegen! Dein neues Level ist ${newLevel}`;
        } else {
          levelUpMessageElement.textContent = `Du hast ${xpReward} XP verdient! Dein aktuelles Level ist ${newLevel}`;
        }
        document.getElementById('winner-screen').append(levelUpMessageElement);
      })
      .catch(error => {
        console.error('Error updating player XP and level:', error);
      });
  }
});