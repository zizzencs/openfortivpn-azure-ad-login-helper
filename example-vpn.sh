#!/bin/bash

# Parameters:
#
# FortiVPN login URL - this should redirect to the Azure AD login page
# Azure AD user
# Azure AD password (in this example fetched from 1Password)
# Azure AD one-time password (in this example fetched from 1Password)
# FortiVPN connection FQDN (note that this FQDN might be different from the FortiVPN login URL's FQDN)
# FortiVPN connection port (if omitted, defaults to 443)

./vpn.sh \
  https://connect.company.com/remote/login \
  user@company.com \
  "$(op item get --fields label=password 'user@company.com')" \
  "$(op item get --otp 'user@company.com')" \
  connect.company.com \
  443
