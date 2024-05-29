let cardData;
let selectedSet;

function preload() {
  // Do not load JSON here as it will be dynamically loaded based on selection
}

function setup() {
  noCanvas();
  
  let setButtons = selectAll('.setButton');
  setButtons.forEach(button => {
    button.mousePressed(() => {
      selectedSet = button.attribute('data-set');
      loadSet(selectedSet);
      setButtons.forEach(btn => btn.removeClass('selected'));
      button.addClass('selected');
    });
  });
  
  let generateButton = select('#generatePackButton');
  generateButton.mousePressed(displayPack);
  console.log("Setup complete, buttons ready.");
}

function loadSet(set) {
  loadJSON(set, data => {
    cardData = data;
    let generateButton = select('#generatePackButton');
    generateButton.style('display', 'block');
    console.log(`Loaded set: ${set}`);
  });
}

function displayPack() {
  if (!cardData) return;
  
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
  let selectedColors = new Set();

  // Add common cards (1 from each ink color)
  while (selectedColors.size < 6) {
    let randomIndex = floor(random(cardData.commonCards.length));
    let card = cardData.commonCards[randomIndex];
    if (!selectedColors.has(card.ink)) {
      pack.push(card);
      selectedColors.add(card.ink);
    }
  }

  // Add uncommon cards
  for (let i = 0; i < 3; i++) {
    let randomIndex = floor(random(cardData.uncommonCards.length));
    pack.push(cardData.uncommonCards[randomIndex]);
  }

  // Add rare/super rare/legendary cards with 60/30/10 distribution
  for (let i = 0; i < 2; i++) {
    let rarityRoll = random(100);
    if (rarityRoll < 10 && cardData.legendaryCards.length > 0) {
      let randomIndex = floor(random(cardData.legendaryCards.length));
      pack.push(cardData.legendaryCards[randomIndex]);
    } else if (rarityRoll < 40 && cardData.superRareCards.length > 0) {
      let randomIndex = floor(random(cardData.superRareCards.length));
      pack.push(cardData.superRareCards[randomIndex]);
    } else if (cardData.rareCards.length > 0) {
      let randomIndex = floor(random(cardData.rareCards.length));
      pack.push(cardData.rareCards[randomIndex]);
    }
  }

  // Add foil card
  let foilOptions = cardData.commonCards.concat(cardData.uncommonCards, cardData.rareCards, cardData.superRareCards, cardData.legendaryCards);
  let foilCard = foilOptions[floor(random(foilOptions.length))];

  // 1 in 100 chance to pull an enchanted card
  if (random(100) < 1 && cardData.enchantedCards.length > 0) {
    foilCard = cardData.enchantedCards[floor(random(cardData.enchantedCards.length))];
  }
  pack.push(foilCard);

  return pack;
}

function revealCard(index) {
  console.log(`Revealing card${index}`);
  let card = document.querySelector(`#card${index} .card-inner`);
  card.classList.add('is-flipped');
}