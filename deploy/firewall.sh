#!/usr/bin/env bash
# Ubuntu/Debian VPS firewall: only SSH and the web ports are open; the game (8080) and the AI (18431) stay on localhost.
set -euo pipefail
apt-get install -y ufw fail2ban unattended-upgrades
ufw default deny incoming
ufw default allow outgoing
ufw limit 22/tcp        # SSH with brute force throttling
ufw allow 80/tcp        # Caddy: http -> https redirect and certificates
ufw allow 443/tcp       # the game over https / wss
ufw --force enable
systemctl enable --now fail2ban
dpkg-reconfigure -f noninteractive unattended-upgrades
# SSH: keys only, no root login
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/; s/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl reload ssh || systemctl reload sshd
ufw status verbose
