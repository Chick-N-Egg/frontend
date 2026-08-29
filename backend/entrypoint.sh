#!/bin/bash
set -e

uvicorn main:app --host 127.0.0.1 --port 8000 &
UVICORN_PID=$!

caddy run --config /etc/caddy/Caddyfile --adapter caddyfile &
CADDY_PID=$!

trap 'kill -TERM "$UVICORN_PID" "$CADDY_PID" 2>/dev/null' TERM INT

wait -n "$UVICORN_PID" "$CADDY_PID"
EXIT_CODE=$?

kill -TERM "$UVICORN_PID" "$CADDY_PID" 2>/dev/null
exit "$EXIT_CODE"
