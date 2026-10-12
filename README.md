<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SebasGames Hub Clone</title>
    <!-- Gekoppeld aan het gegenereerde CSS bestand -->
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Header / Navigatie -->
    <header class="main-header">
        <div class="header-container">
            <div class="logo-wrapper">
                <span class="logo-text">SEBASGAMES</span>
                <span class="version-badge">v1.0</span>
            </div>
            <nav class="main-nav">
                <a href="#" class="nav-link">Home</a>
                <a href="#" class="nav-link">Alle Games</a>
                <a href="#" class="nav-link">Leaderboard</a>
            </nav>
        </div>
    </header>

    <!-- Hoofdinhoud -->
    <main class="main-content">
        <!-- Welkom banner -->
        <div class="welcome-banner">
            <div class="banner-text">
                <h1 class="banner-title">Welkom bij de <span class="highlight-cyan">SebasGames</span> Clone</h1>
                <p class="banner-description">Een interactieve arcade nagebouwd met pure CSS/SCSS standaarden geïnspireerd op het Base44-platform.</p>
            </div>
            <button onclick="scrollToGame()" class="cta-button">Speel Nu 🎮</button>
        </div>

        <!-- Arcade Sectie -->
        <div id="game-section" class="arcade-grid">
            <!-- Game Scherm (Links/Midden) -->
            <div class="game-display">
                <div class="game-header">
                    <h2 class="game-title">
                        <span class="live-indicator"></span> Retro Snake
                    </h2>
                    <div class="score-badge">
                        Score: <span id="current-score" class="highlight-cyan font-bold">0</span>
                    </div>
                </div>

                <!-- Canvas voor de game -->
                <canvas id="gameCanvas" width="400" height="400" class="game-canvas"></canvas>

                <!-- Besturing voor Toetsenbord -->
                <div class="controls-hint">
                    Gebruik de <kbd class="kbd-key">pijltjestoetsen</kbd> op je toetsenbord om te sturen.
                </div>
            </div>

            <!-- Zijbalk / Community & Info (Rechts) -->
            <div class="sidebar">
                <div class="sidebar-card">
                    <h3 class="card-title text-fuchsia">🏆 Live Leaderboard</h3>
                    <ul class="leaderboard-list">
                        <li class="leaderboard-item">
                            <span class="player-name"><strong class="rank-1">1.</strong> Sebas</span>
                            <span class="player-score">1,240 pts</span>
                        </li>
                        <li class="leaderboard-item">
                            <span class="player-name"><strong class="rank-2">2.</strong> AI_Player</span>
                            <span class="player-score">850 pts</span>
                        </li>
                        <li class="leaderboard-item">
                            <span class="player-name"><strong class="rank-3">3.</strong> Gast_44</span>
                            <span class="player-score">410 pts</span>
                        </li>
                    </ul>
                </div>

                <div class="sidebar-card">
                    <h3 class="card-title text-cyan">Over deze kloon</h3>
                    <p class="card-description">
                        Dit is een lokaal nagebouwde frontend van de populaire web-arcade. Het maakt gebruik van HTML5 Canvas voor vlekkeloze spelprestaties zonder plugins.
                    </p>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="main-footer">
        <p>&copy; 2026 SebasGames Clone. Gebouwd voor amusementsdoeleinden.</p>
    </footer>

    <!-- Game Logica (JavaScript) -->
    <script>
        function scrollToGame() {
            document.getElementById('game-section').scrollIntoView({ behavior: 'smooth' });
        }

        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        const scoreElement = document.getElementById("current-score");

        const grid = 20;
        let count = 0;
        let score = 0;

        let snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 };
        let apple = { x: 320, y: 320 };

        function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; }

        function loop() {
            requestAnimationFrame(loop);
            if (++count < 6) return;
            count = 0;

            ctx.clearRect(0,0,canvas.width,canvas.height);
            snake.x += snake.dx;
            snake.y += snake.dy;

            if (snake.x < 0) snake.x = canvas.width - grid;
            else if (snake.x >= canvas.width) snake.x = 0;
            if (snake.y < 0) snake.y = canvas.height - grid;
            else if (snake.y >= canvas.height) snake.y = 0;

            snake.cells.unshift({x: snake.x, y: snake.y});
            if (snake.cells.length > snake.maxCells) snake.cells.pop();

            ctx.fillStyle = '#ef4444';
            ctx.fillRect(apple.x, apple.y, grid-1, grid-1);

            snake.cells.forEach(function(cell, index) {
                ctx.fillStyle = index === 0 ? '#4ade80' : '#22c55e';
                ctx.fillRect(cell.x, cell.y, grid-1, grid-1);  

                if (cell.x === apple.x && cell.y === apple.y) {
                    snake.maxCells++;
                    score += 10;
                    scoreElement.textContent = score;
                    apple.x = getRandomInt(0, 20) * grid;
                    apple.y = getRandomInt(0, 20) * grid;
                }

                for (let i = index + 1; i < snake.cells.length; i++) {
                    if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                        snake.x = 160; snake.y = 160; snake.cells = []; snake.maxCells = 4;
                        snake.dx = grid; snake.dy = 0; score = 0; scoreElement.textContent = score;
                        apple.x = getRandomInt(0, 20) * grid; apple.y = getRandomInt(0, 20) * grid;
                    }
                }
            });
        }

        document.addEventListener('keydown', function(e) {
            if([37, 38, 39, 40].includes(e.keyCode)) e.preventDefault();
            if (e.which === 37 && snake.dx === 0) { snake.dx = -grid; snake.dy = 0; }
            else if (e.which === 38 && snake.dy === 0) { snake.dy = -grid; snake.dx = 0; }
            else if (e.which === 39 && snake.dx === 0) { snake.dx = grid; snake.dy = 0; }
            else if (e.which === 40 && snake.dy === 0) { snake.dy = grid; snake.dx = 0; }
        });

        requestAnimationFrame(loop);
    </script>
</body>
</html>
