document.addEventListener('DOMContentLoaded', function() {
  var cardsTab = document.getElementById('cards-tab');
  var levelsTab = document.getElementById('levels-tab');
  var cardsContent = document.getElementById('cards-content');
  var levelsContent = document.getElementById('levels-content');
  var addCardBtn = document.getElementById('add-card');
  var addLevelBtn = document.getElementById('add-level');
  var levelsList = document.getElementById('levels-list');
  var levelNumberInput = document.getElementById('level-number');
  var playtimeInput = document.getElementById('playtime');
  var numOfCardsInput = document.getElementById('num-of-cards');

  cardsTab.addEventListener('click', function() {
    cardsTab.classList.add('active');
    levelsTab.classList.remove('active');
    cardsContent.style.display = 'block';
    levelsContent.style.display = 'none';
    addLevelBtn.style.display = 'none'; 
  });

  levelsTab.addEventListener('click', function() {
    levelsTab.classList.add('active');
    cardsTab.classList.remove('active');
    levelsContent.style.display = 'block';
    cardsContent.style.display = 'none';
    addLevelBtn.style.display = 'block'; 
  });

    addLevelBtn.addEventListener('click', function() {
      var levelNumber = levelNumberInput.value;
      var playtime = playtimeInput.value;
      var numOfCards = numOfCardsInput.value;
      
      if (levelNumber !== '' && playtime !== '' && numOfCards !== '') {
        var newLevel = document.createElement('li');
        newLevel.textContent = 'Level ' + levelNumber + ' - Playtime: ' + playtime + ' min - Cards: ' + numOfCards;
        levelsList.appendChild(newLevel);
        
        levelNumberInput.value = '';
        playtimeInput.value = '';
        numOfCardsInput.value = '';
      } else {
        alert('Please fill in all fields.');
      }
    });
    
    addCardBtn.addEventListener('click', function() {
      var cardNameInput = document.getElementById('card-name-input');
      var cardImageInput = document.getElementById('card-image-input');
  
      if (cardNameInput.value.trim() === '' || cardImageInput.files.length === 0) {
        alert('Please enter a name and select an image for the card.');
        return;
      }
  
      var newCard = document.createElement('div');
      newCard.classList.add('card');
      var cardImage = document.createElement('img');
      cardImage.alt = "Card Image";
      var fileReader = new FileReader();
      fileReader.onload = function(e) {
        cardImage.src = e.target.result;
      };
      fileReader.readAsDataURL(cardImageInput.files[0]);
      newCard.appendChild(cardImage);
      var cardName = document.createElement('p');
      cardName.textContent = cardNameInput.value.trim();
      newCard.appendChild(cardName);
  
      var emptyCard = document.querySelector('.empty-card');
      if (emptyCard) {
        cardsContent.insertBefore(newCard, emptyCard);
      } else {
        cardsContent.appendChild(newCard);
      }
  
      cardNameInput.value = '';
      cardImageInput.value = '';
    });
  });