#!/bin/bash
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

if [ ! -d "dist" ] && [ -d "node_modules/vite" ]; then
  npm run build
fi

echo "正在启动《魔兽大作战 · 单机版》本地服务..."
node scripts/serve.mjs --port 4173 --open
