// script.js

document.addEventListener('DOMContentLoaded', () => {
  const cardImages = [
    '1.png', '1.png', '2.png', '2.png', '3.png', '3.png',
    '4.png', '4.png', '5.png', '5.png', '6.png', '6.png', 
    '7.png', '7.png', '8.png', '8.png'
  ];

  const cardBack = 'card-back.png';

  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;

  let moves = 0;
  let matchedPairs = 0;

  const memoryBoard = document.querySelector('.memory-board');

  // Shuffle the card images
  cardImages.sort(() => 0.5 - Math.random());

  // Create card elements
  cardImages.forEach(image => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('memory-card');
    cardElement.innerHTML = `
      <img class="front-face" src="${cardBack}" alt="Card Back">
      <img class="back-face" src="${image}" alt="Card">
    `;
    cardElement.addEventListener('click', flipCard);
    memoryBoard.appendChild(cardElement);
  });

  // Flip card function
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

  // Check for card match
  function checkForMatch() {
    let isMatch = firstCard.querySelector('.back-face').src === secondCard.querySelector('.back-face').src;

    isMatch ? disableCards() : unflipCards();
    incrementMoves();
  }

// Disable matched cards
function disableCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.style.visibility = 'hidden';
    secondCard.style.visibility = 'hidden';

    matchedPairs++;

    if (matchedPairs === cardImages.length / 2) {
      // All pairs have been matched, game over
    }

    resetBoard();
  }, 1000); // Delay before deleting cards
}

  // Unflip unmatched cards
  function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');

      resetBoard();
    }, 1000);
  }

  // Reset board state
  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  // Increment moves counter
  function incrementMoves() {
    moves++;
  }
});
