#!/bin/bash

login_url="${1}"
login_user="${2}"
login_password="${3}"
login_otp="${4}"

vpn_host="${5}"
vpn_port="${6:-443}"

temp_file=$(mktemp)

echo
echo "Fetching the authentication token..."
echo

docker run -i --init --cap-add=SYS_ADMIN --rm ghcr.io/puppeteer/puppeteer:latest \
  node -e "$(cat login.js)" "${login_url}" "${login_user}" "${login_password}" "${login_otp}" \
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
