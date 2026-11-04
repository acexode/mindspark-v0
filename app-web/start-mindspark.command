#!/bin/bash
# Double-click to build and run Mindspark in production mode (faster than `npm run dev`).
# macOS opens .command files in Terminal. Re-run after pulling new code: it rebuilds each time.

cd "$(dirname "$0")" || exit 1

# Finder launches skip your shell profile, so load the usual places Node can live.
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh"

if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js was not found. Install it from https://nodejs.org and try again."
  read -r -p "Press Return to close."
  exit 1
fi

[ -d node_modules ] || { echo "Installing dependencies..."; npm install || { read -r -p "Install failed. Press Return to close."; exit 1; }; }

echo "Building..."
if ! npm run build; then
  echo; echo "Build failed. Scroll up for the error."
  read -r -p "Press Return to close."
  exit 1
fi

PORT="${PORT:-3000}"
echo; echo "Starting on http://localhost:$PORT  (press Ctrl+C to stop)"
(sleep 4 && open "http://localhost:$PORT") &
PORT="$PORT" npm start
