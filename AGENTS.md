# GameHub — Base44 Setup Notes

## Project overview
Static HTML/CSS/JS game website (no build step, no backend, no database).
Three mini-games: Memory, Tic-Tac-Toe, and Number Guessing.

## Running in the sandbox
```
docker compose -f docker-compose.base44.yml up -d
```
Serves `index.html` on port 3000 via nginx:alpine with the repo bind-mounted read-only.

## Quirks
- The repo root directory has `700` permissions in the sandbox. nginx workers
  run as the `nginx` user and get 403 Forbidden. The compose `command:` patches
  `nginx.conf` to run workers as `root` so the bind mount is readable.
- The original repo had CSS in `script.js` and no `style.css`. The CSS was moved
  to `style.css` (where `index.html` expects it) and `script.js` now contains the
  game logic that the HTML elements reference.

## Verification
- `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` → 200
- All three games should be interactive in the browser preview.
