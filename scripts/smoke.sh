#!/usr/bin/env bash
set -euo pipefail

BASE_URL=${BASE_URL:-http://localhost:3000}

echo "Waiting for web on ${BASE_URL} ..."
for i in {1..100}; do
  if curl -fsS "${BASE_URL}/" >/dev/null; then
    break
  fi
  sleep 0.2
done

pass=0
fail=0

check() {
  local method=$1
  local path=$2
  local url="${BASE_URL}${path}"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$url") || code=000
  if [[ "$code" =~ ^(2|3)[0-9][0-9]$ ]]; then
    printf "PASS %s %s -> %s\n" "$method" "$path" "$code"
    pass=$((pass+1))
  else
    printf "FAIL %s %s -> %s\n" "$method" "$path" "$code"
    fail=$((fail+1))
  fi
}

echo "Running smoke checks against ${BASE_URL}"
check GET    "/"
check GET    "/post/1"
check GET    "/search"
check GET    "/about"
check GET    "/contact"
check GET    "/archive?month=1&year=2025"
check GET    "/category/tech"
check GET    "/feed.xml"
check GET    "/admin/messages"
check GET    "/system"
check GET    "/.config.bak"
check GET    "/api/debug"
check GET    "/api/preview?url=http://example.com"
check POST   "/api/webhook/validate?callback=http://example.com/ok"
check GET    "/api/search?q=hello"
check GET    "/api/posts"
check GET    "/api/posts/1"
check GET    "/redirect?to=/"

echo "----"
echo "Total: PASS=$pass FAIL=$fail"

if [ "$fail" -eq 0 ]; then
  exit 0
else
  exit 1
fi



