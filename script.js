// GameHub — game logic for Memory, Tic-Tac-Toe and Number Guessing

const scores = { memory: 0, ttt: 0, guess: 0 };

function updateTotalScore() {
  const total = scores.memory + scores.ttt + scores.guess;
  document.getElementById('total-score').textContent = total;
}

function setMood(text) {
  document.getElementById('mood-status').textContent = text;
}

/* ===================== Memory ===================== */
const memoryEmojis = ['🎮', '🎯', '🎲', '🏆', '⭐', '🎨', '🎭', '🕹️'];
let memoryCards = [];
let memoryFlipped = [];
let memoryLock = false;
let memoryMatched = 0;

function buildMemoryBoard() {
  const board = document.getElementById('memory-board');
  board.innerHTML = '';
  memoryCards = [...memoryEmojis, ...memoryEmojis]
    .map((emoji) => ({ emoji, shuffled: Math.random() }))
    .sort((a, b) => a.shuffled - b.shuffled)
    .map((item) => item.emoji);

  memoryFlipped = [];
  memoryLock = false;
  memoryMatched = 0;

  memoryCards.forEach((emoji, index) => {
    const card = document.createElement('button');
    card.className = 'memory-card hidden';
    card.type = 'button';
    card.textContent = emoji;
    card.dataset.index = index;
    card.addEventListener('click', () => flipMemoryCard(card, index));
    board.appendChild(card);
  });
}

function flipMemoryCard(card, index) {
  if (memoryLock) return;
  if (card.classList.contains('matched') || card.classList.contains('flipped')) return;

  card.classList.remove('hidden');
  card.classList.add('flipped');
  memoryFlipped.push({ card, index });

  if (memoryFlipped.length === 2) {
    memoryLock = true;
    const [first, second] = memoryFlipped;

    if (memoryCards[first.index] === memoryCards[second.index]) {
      first.card.classList.add('matched');
      second.card.classList.add('matched');
      memoryMatched += 2;
      scores.memory += 10;
      document.getElementById('memory-score').textContent = scores.memory;
      updateTotalScore();
      setMood('Nice match! 🎉');
      memoryFlipped = [];
      memoryLock = false;

      if (memoryMatched === memoryCards.length) {
        setMood('Memory complete! 🏆');
      }
    } else {
      setTimeout(() => {
        first.card.classList.add('hidden');
        first.card.classList.remove('flipped');
        second.card.classList.add('hidden');
        second.card.classList.remove('flipped');
        memoryFlipped = [];
        memoryLock = false;
      }, 800);
    }
  }
}

document.getElementById('memory-reset').addEventListener('click', () => {
  buildMemoryBoard();
  setMood('Memory reset');
});

/* ===================== Tic-Tac-Toe ===================== */
let tttBoard = Array(9).fill('');
let tttCurrent = 'X';
let tttActive = true;

const tttWinCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function tttCheckWin() {
  for (const combo of tttWinCombos) {
    const [a, b, c] = combo;
    if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) {
      return tttBoard[a];
    }
  }
  if (tttBoard.every((cell) => cell)) return 'draw';
  return null;
}

function tttHandleClick(cell, index) {
  if (!tttActive || tttBoard[index]) return;

  tttBoard[index] = tttCurrent;
  cell.textContent = tttCurrent;
  cell.disabled = true;

  const result = tttCheckWin();
  if (result === 'draw') {
    document.getElementById('ttt-status').textContent = 'Gelijkspel!';
    tttActive = false;
    setMood('Draw 🤝');
  } else if (result) {
    document.getElementById('ttt-status').textContent = `Speler ${result} wint!`;
    scores.ttt += 10;
    document.getElementById('ttt-score').textContent = scores.ttt;
    updateTotalScore();
    tttActive = false;
    setMood(`${result} wins! 🏆`);
  } else {
    tttCurrent = tttCurrent === 'X' ? 'O' : 'X';
    document.getElementById('ttt-status').textContent = `Speler ${tttCurrent} is aan de beurt`;
  }
}

function buildTicTacToe() {
  tttBoard = Array(9).fill('');
  tttCurrent = 'X';
  tttActive = true;
  document.getElementById('ttt-status').textContent = 'Speler X is aan de beurt';

  document.querySelectorAll('.cell').forEach((cell) => {
    cell.textContent = '';
    cell.disabled = false;
    cell.addEventListener('click', () => tttHandleClick(cell, Number(cell.dataset.index)));
  });
}

document.getElementById('ttt-reset').addEventListener('click', () => {
  buildTicTacToe();
  setMood('Tic-Tac-Toe reset');
});

/* ===================== Number Guessing ===================== */
let guessTarget = 0;
let guessAttempts = 0;
let guessActive = true;

function newGuessGame() {
  guessTarget = Math.floor(Math.random() * 100) + 1;
  guessAttempts = 0;
  guessActive = true;
  document.getElementById('guess-message').textContent = 'Je hebt 0 poging(en).';
  document.getElementById('guess-input').value = '';
  setMood('New number game 🎲');
}

function checkGuess() {
  if (!guessActive) return;
  const input = document.getElementById('guess-input');
  const value = parseInt(input.value, 10);

  if (isNaN(value) || value < 1 || value > 100) {
    document.getElementById('guess-message').textContent = 'Voer een getal tussen 1 en 100 in.';
    return;
  }

  guessAttempts++;
  const msg = document.getElementById('guess-message');

  if (value === guessTarget) {
    const points = Math.max(100 - guessAttempts * 10, 10);
    scores.guess += points;
    document.getElementById('guess-score').textContent = scores.guess;
    updateTotalScore();
    msg.textContent = `Correct! Je raadde het in ${guessAttempts} poging(en). +${points} punten.`;
    guessActive = false;
    setMood('Guessed it! 🎯');
  } else if (value < guessTarget) {
    msg.textContent = `Poging ${guessAttempts}: Hoger! ⬆️`;
  } else {
    msg.textContent = `Poging ${guessAttempts}: Lager! ⬇️`;
  }

  input.value = '';
}

document.getElementById('guess-submit').addEventListener('click', checkGuess);
document.getElementById('guess-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkGuess();
});
document.getElementById('guess-reset').addEventListener('click', newGuessGame);

/* ===================== Init ===================== */
buildMemoryBoard();
buildTicTacToe();
newGuessGame();
