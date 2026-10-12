/**
 * SebasGames Hub - Core Javascript
 * Beheert de game-loop, invoerregistratie en UI-interacties.
 */

// 1. UI Interactie: Soepel scrollen naar het spelscherm
function scrollToGame() {
    const gameSection = document.getElementById('game-section');
    if (gameSection) {
        gameSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 2. Snake Game Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("current-score");

// Constanten voor het raster (grid)
const grid = 20;
let count = 0;
let score = 0;

// Objectstructuur voor de slang
let snake = {
    x: 160,
    y: 160,
    dx: grid, // Snelheid horizontaal (start naar rechts)
    dy: 0,    // Snelheid verticaal
    cells: [],
    maxCells: 4 // Startlengte van de slang
};

// Objectstructuur voor de appel
let apple = {
    x: 320,
    y: 320
};

/**
 * Genereert een willekeurig getal binnen een specifiek bereik
 * Wordt gebruikt om de appel willekeurig te herplaatsen
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * De hoofd Game Loop die continu ververst
 */
function loop() {
    requestAnimationFrame(loop);

    // Vertraag de animatie (fps limiter): voer de logica uit om de 6 frames (ca. 10 FPS)
    if (++count < 6) {
        return;
    }
    count = 0;

    // Maak het canvas leeg voor de nieuwe frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Beweeg de slang op basis van zijn huidige snelheid richting
    snake.x += snake.dx;
    snake.y += snake.dy;

    // Randdetectie (Wrap-around: slang komt aan de overkant weer tevoorschijn)
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }
    
    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    // Voeg de nieuwe positie van de kop toe aan het begin van de cellen-array
    snake.cells.unshift({ x: snake.x, y: snake.y });

    // Verwijder de laatste cel van de staart om de lengte consistent te houden
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // --- TEKEN DE APPEL ---
    ctx.fillStyle = '#ef4444'; // Helder rood
    ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // --- TEKEN & CONTROLER DE SLANG ---
    snake.cells.forEach(function(cell, index) {
        // Geef de kop een iets lichtere tint groen dan het lichaam voor visueel contrast
        ctx.fillStyle = (index === 0) ? '#4ade80' : '#22c55e';
        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);  

        // Slang eet de appel op
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score += 10;
            if (scoreElement) {
                scoreElement.textContent = score;
            }

            // Plaats de appel direct op een willekeurige nieuwe positie in het grid
            apple.x = getRandomInt(0, 20) * grid;
            apple.y = getRandomInt(0, 20) * grid;
        }

        // Botsingsdetectie met eigen lichaam (Game Over check)
        // We controleren of de kop (index 0) dezelfde positie deelt met een staartstuk (i > 0)
        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                resetGame();
            }
        }
    });
}

/**
 * Reset alle variabelen naar de beginwaarden wanneer de speler af is
 */
function resetGame() {
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    score = 0;
    if (scoreElement) {
        scoreElement.textContent = score;
    }
    apple.x = getRandomInt(0, 20) * grid;
    apple.y = getRandomInt(0, 20) * grid;
}

// 3. Toetsenbord Input Registratie
document.addEventListener('keydown', function(e) {
    // Array met KeyCodes van pijltjestoetsen om default browser-scrolling te blokkeren
    const arrowKeys =;
    if (arrowKeys.includes(e.which)) {
        e.preventDefault();
    }

    // Pijltje Links (en mag niet direct naar rechts omkeren)
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
    // Pijltje Omhoog (en mag niet direct naar beneden omkeren)
    else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    // Pijltje Rechts (en mag niet direct naar links omkeren)
    else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    // Pijltje Omlaag (en mag niet direct omhoog omkeren)
    else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

// 4. Start de Game Loop zodra het script geladen is
requestAnimationFrame(loop);
