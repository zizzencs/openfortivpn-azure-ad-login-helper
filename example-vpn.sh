#!/bin/bash

# Parameters:
#
# FortiVPN login URL - this should redirect to the Azure AD login page
# Azure AD user
# Azure AD password (in this example fetched from 1Password)
# Azure AD one-time password (in this example fetched from 1Password)
# FortiVPN connection FQDN (note that this FQDN might be different from the FortiVPN login URL's FQDN)
# FortiVPN connection port (if omitted, defaults to 443)

export login_url=https://connect.company.com/remote/login
export login_user=user@company.com
login_password="$(op item get --fields label=password 'user@company.com')"
export login_password
login_otp="$(op item get --otp 'user@company.com')"
export login_otp
export vpn_host=connect.company.com
export vpn_port=443

./vpn.sh
