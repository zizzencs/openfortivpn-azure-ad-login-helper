# openfortivpn-azure-ad-login-helper

This repository contains a puppeteer script that can do an Azure AD login without an actual browser + some shell scripts to run the pupeteer script.

## Inspired by

- **openfortivpn**: https://github.com/adrienverge/openfortivpn
- **fuckForticlient.sh**: https://gist.github.com/nonamed01/0961d8a79955206ebdc00abcaa56aefe
- and a lot of pain caused by the official FortiClient

## Recommended usage

- copy `example-vpn.sh` to a new script
- add your authentication credentials and/or methods to fetch them to the new script
- amend the script with any IP address/route and DNS manipulation that suits your needs (e.g. remove the automatically set default route or overwrite the automatically set DNS server)
- you can run the script as a systemd unit if you want automatic restarts
