#!/bin/bash

export login_url="${1:-$login_url}"
export login_user="${2:-$login_user}"
export login_password="${3:-$login_password}"
export login_otp="${4:-$login_otp}"

export vpn_host="${5:-$vpn_host}"
export vpn_port="${6:-$vpn_port}"

temp_file=$(mktemp)

echo
echo "Fetching the authentication token..."
echo

docker run -i --init --cap-add=SYS_ADMIN --rm \
  -e login_url -e login_user -e login_password -e login_otp \
  ghcr.io/puppeteer/puppeteer:latest \
  node -e "$(cat login.js)" \
  2> "${temp_file}"

echo
echo "Connecting to the VPN..."
echo

(sudo openfortivpn "${vpn_host}:${vpn_port}" --cookie-on-stdin) < "${temp_file}" &
pid=$!

sleep 3

echo
echo "PID: ${pid} - send a SIGTERM signal as root to this if you want to stop the VPN"
echo
echo "Connected..."

exit 0
