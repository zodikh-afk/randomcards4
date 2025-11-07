const suits = [
  { symbol: '♥', color: 'red' },
  { symbol: '♦', color: 'red' },
  { symbol: '♣', color: 'black' },
  { symbol: '♠', color: 'black' }
];
const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

function randomCard() {
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const value = values[Math.floor(Math.random() * values.length)];
  return { value, suit };
}

function cardValue(value) {
  if (value === 'A') return 14;
  if (value === 'K') return 13;
  if (value === 'Q') return 12;
  if (value === 'J') return 11;
  return parseInt(value);
}

let players = {};
function getElems(p) {
  return {
    inner: document.getElementById(`cardInner${p}`),
    front: document.getElementById(`cardFront${p}`)
  };
}

function showCardOnce(p, card, isFinal) {
  const { inner, front } = getElems(p);
  front.className = `card-face card-front ${card.suit.color}`;
  front.innerHTML = `
    <div class="corner top">${card.value}<br>${card.suit.symbol}</div>
    <div class="center">${card.suit.symbol}</div>
    <div class="corner bottom">${card.value}<br>${card.suit.symbol}</div>
  `;
  inner.classList.add('flip');
  if (!isFinal) setTimeout(() => inner.classList.remove('flip'), 600);
}

function drawCards(p, count) {
  const flipDuration = 1000;
  let delay = 0;
  let finalCard = null;

  for (let i = 0; i < count; i++) {
    const card = randomCard();
    finalCard = card;
    const isFinal = i === count - 1;
    setTimeout(() => showCardOnce(p, card, isFinal), delay);
    delay += flipDuration;
  }

  setTimeout(() => {
    players[p] = finalCard;
    checkWinner();
  }, delay + 50);
}

function createPlayers(num) {
  const container = document.getElementById('game-container');
  container.className = "game";
  container.innerHTML = '';
  players = {};

  for (let i = 1; i <= num; i++) {
    const playerHTML = `
      <div class="player">
        <h2>Игрок ${i}</h2>
        <div class="deck" id="deck${i}">
          <div class="card">
            <div class="card-inner" id="cardInner${i}">
              <div class="card-face card-back"><span class="back-symbol">🂠</span></div>
              <div class="card-face card-front" id="cardFront${i}"></div>
            </div>
          </div>
        </div>
        <div class="controls">
          <button onclick="drawCards(${i}, 1)">1 карта</button>
          <button onclick="drawCards(${i}, 3)">3 карты</button>
          <button onclick="drawCards(${i}, 5)">5 карт</button>
        </div>
      </div>
    `;
    container.innerHTML += playerHTML;
  }
}

function checkWinner() {
  const total = Object.keys(players).length;
  const filled = Object.values(players).filter(Boolean).length;
  if (filled < total) return;

  const results = Object.entries(players).map(([p, c]) => ({
    player: p,
    value: cardValue(c.value)
  }));
  const max = Math.max(...results.map(r => r.value));
  const winners = results.filter(r => r.value === max);

  const resultDiv = document.getElementById('result');
  if (winners.length === 1) {
    resultDiv.textContent = `🏆 Победил Игрок ${winners[0].player}!`;
    resultDiv.style.color = 'lime';
  } else {
    resultDiv.textContent = '🤝 Ничья!';
    resultDiv.style.color = 'white';
  }

  setTimeout(() => {
    Object.keys(players).forEach(resetCard);
    Object.keys(players).forEach(p => players[p] = null);
    resultDiv.textContent = '';
  }, 3500);
}

function resetCard(p) {
  const { inner, front } = getElems(p);
  inner.classList.remove('flip');
  front.className = 'card-face card-front';
  front.innerHTML = '';
}
