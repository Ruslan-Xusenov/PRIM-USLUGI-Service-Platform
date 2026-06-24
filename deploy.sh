#!/bin/bash
set -e

DOMAIN="primuslugi.ruslandev.uz"
REPO="https://github.com/Ruslan-Xusenov/PRIM-USLUGI-Service-Platform.git"
WEB_DIR="/var/www/$DOMAIN"

echo "Updating packages..."
apt-get update -y

echo "Installing curl, git, nginx, certbot..."
apt-get install -y curl git nginx python3-certbot-nginx

if ! command -v node &> /dev/null
then
    echo "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null
then
    echo "Installing pm2..."
    npm install -g pm2
fi

echo "Setting up application directory..."
if [ -d "$WEB_DIR" ]; then
    rm -rf "$WEB_DIR"
fi
git clone "$REPO" "$WEB_DIR"
cd "$WEB_DIR"

echo "Installing dependencies and building..."
npm install
npm run build

echo "Starting with pm2..."
pm2 delete "$DOMAIN" || true
pm2 start npm --name "$DOMAIN" -- run start
pm2 save
pm2 startup systemd -u root --hp /root || true

echo "Setting up Nginx..."
cat << 'NGINX' > /etc/nginx/sites-available/$DOMAIN
server {
    listen 80;
    server_name primuslugi.ruslandev.uz;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

echo "Attempting to get SSL certificate..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --register-unsafely-without-email || true

echo "Deployment complete!"