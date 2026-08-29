#!/bin/bash
set -e

node dist/channel-catalog/seed/seed-channel-catalog.js
node dist/main.js &
NODE_PID=$!

caddy run --config /etc/caddy/Caddyfile --adapter caddyfile &
CADDY_PID=$!

trap 'kill -TERM "$NODE_PID" "$CADDY_PID" 2>/dev/null' TERM INT

wait -n "$NODE_PID" "$CADDY_PID"
EXIT_CODE=$?

kill -TERM "$NODE_PID" "$CADDY_PID" 2>/dev/null
exit "$EXIT_CODE"
