#!/bin/bash


sudo dnf update -y

echo "Instalando y configurando PostgreSQL"
sudo dnf install postgresql16 postgresql16-server -y

sudo postgresql-setup --initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql

sed -i "s/#listen_addresses = 'localhost'/listen_addresses = 'localhost'/" /var/lib/pgsql/data/postgresql.conf

cat > /var/lib/pgsql/data/pg_hba.conf << 'EOF'
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                peer
local   all             all                                     scram-sha-256
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256
EOF

systemctl restart postgresql


sudo -u postgres psql << EOF
CREATE DATABASE generadordewebs;
CREATE USER diego_user WITH ENCRYPTED PASSWORD 'scPP8UUB';
GRANT ALL PRIVILEGES ON DATABASE generadordewebs TO diego_user;
ALTER DATABASE generadordewebs OWNER TO diego_user;
EOF

sudo -u postgres psql -d generadordewebs << EOF
GRANT ALL ON SCHEMA public TO diego_user;
EOF


echo "Instalando Nginx"
sudo dnf install nginx -y


cat > /etc/nginx/conf.d/nextjs.conf << 'EOF'
server {
    listen 80;
    server_name localhost;

    client_max_body_size 20M;

    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;

    set_real_ip_from 0.0.0.0/0;
    real_ip_header X-Forwarded-For;
    real_ip_recursive on;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_bypass $http_upgrade;
        expires 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location /imgs/ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    location /products/ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }

    access_log /var/log/nginx/nextjs-access.log;
    error_log /var/log/nginx/nextjs-error.log;
}
EOF

systemctl enable nginx
systemctl start nginx


echo "Instalando Node 24 LTS"

curl -fsSL https://rpm.nodesource.com/setup_24.x | sudo bash -
sudo dnf install nodejs -y


echo "Instalando PM2"
sudo npm install -g pm2

echo "Instalando Git"
sudo dnf install git -y

echo "Lanzando aplicacion"
cd /home/ec2-user
git clone https://github.com/DiegoChilleron/proyecto-final-daw.git
chown -R ec2-user:ec2-user proyecto-final-daw

cat > proyecto-final-daw/.env << 'EOF'
DB_USER=XX
DB_PASSWORD=XX
DB_NAME=XX

BETTER_AUTH_SECRET="XX"
BETTER_AUTH_URL=https://diegochilleron.store
NEXT_PUBLIC_BETTER_AUTH_URL=https://diegochilleron.store

DATABASE_URL="postgresql://XX@XX:5432/XX?schema=public"

# PayPal Credenciales (https://developer.paypal.com/)
NEXT_PUBLIC_PAYPAL_CLIENT_ID="XX"
PAYPAL_CLIENT_SECRET="XX"

PAYPAL_OAUTH_URL=https://api-m.sandbox.paypal.com/v1/oauth2/token
PAYPAL_ORDERS_URL=https://api.sandbox.paypal.com/v2/checkout/orders

# Cloudinary (https://console.cloudinary.com/)
CLOUDINARY_URL="cloudinary://XX:XX@XX"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="XX"
NEXT_PUBLIC_CLOUDINARY_API_KEY="XX"
CLOUDINARY_API_SECRET="XX"

# AWS S3

EOF

chown ec2-user:ec2-user .env

cd /home/ec2-user/proyecto-final-daw
sudo -u ec2-user npm install
sudo -u ec2-user npx prisma generate
sudo -u ec2-user npx prisma migrate deploy
sudo -u ec2-user npm run seed
sudo -u ec2-user npm run build

sudo -u ec2-user bash -c 'cd /home/ec2-user/proyecto-final-daw && pm2 start ecosystem.config.js'
sudo -u ec2-user pm2 save

pm2 startup systemd -u ec2-user --hp /home/ec2-user
sudo -u ec2-user pm2 save

echo "Configuracion completada!"
