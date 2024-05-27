let cardData;

function preload() {
  cardData = loadJSON('cards.json');
}

function setup() {
  noCanvas();
  let button = select('#generatePackButton');
  button.mousePressed(displayPack);
  console.log("Setup complete, button ready.");
}

function displayPack() {
  let pack = generatePack();
  let packDisplay = select('#packDisplay');
  packDisplay.html(''); // Clear previous pack display
  console.log("Displaying pack...");

  pack.forEach((card, i) => {
    let cardHTML = `
      <div class="card ${card.rarity}" id="card${i}">
        <div class="card-inner">
          <div class="card-front">
            <img src="images/CardBack.jpg" alt="Card Back">
          </div>
          <div class="card-back">
            <img src="${card.image}" alt="${card.name}">
            <h3>${card.name}</h3>
          </div>
        </div>
      </div>
    `;
    packDisplay.html(packDisplay.html() + cardHTML);
  });

  pack.forEach((_, i) => {
    let cardElement = document.getElementById(`card${i}`);
    cardElement.addEventListener('click', () => revealCard(i));
    console.log(`Event listener attached to card${i}`);
  });
}

function generatePack() {
  let pack = [];
  
  // Add one common card of each ink color
  let inkColors = ["amber", "amethyst", "emerald", "ruby", "sapphire", "steel"];
  inkColors.forEach(ink => {
    let filteredCommonCards = cardData.commonCards.filter(card => card.ink === ink);
    pack.push(randomCard(filteredCommonCards));
  });

  // Add remaining common cards
  for (let i = 0; i < 6 - inkColors.length; i++) {
    pack.push(randomCard(cardData.commonCards));
  }

  // Add uncommon cards
  pack = pack.concat(generateRandomCards(cardData.uncommonCards, 3));

  // Add 2 rare/super rare/legendary cards
  let rareCards = cardData.rareCards.concat(cardData.superRareCards, cardData.legendaryCards);
  pack = pack.concat(generateRandomCards(rareCards, 2));

  // Add foil card
  let allCards = cardData.commonCards.concat(cardData.uncommonCards, rareCards);
  let foilCard = randomCard(allCards);
  
  // Check for Enchanted card chance
  if (random(1) < .01) {
    foilCard = randomCard(cardData.enchantedCards);
  }
  
  pack.push(foilCard);

  return pack;
}

function generateRandomCards(cardArray, count) {
  let selectedCards = [];
  for (let i = 0; i < count; i++) {
    selectedCards.push(randomCard(cardArray));
  }
  return selectedCards;
}

function randomCard(cardArray) {
  let randomIndex = floor(random(cardArray.length));
  return cardArray[randomIndex];
}

function revealCard(index) {
  console.log(`Revealing card${index}`);
  let card = document.querySelector(`#card${index} .card-inner`);
  card.classList.add('is-flipped');
}