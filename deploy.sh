#!/bin/bash

# Prim-Uslugi Deployment Script
# This script automates the deployment process using Docker Compose.

# 1. Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment of Prim-Uslugi...${NC}"

# 2. Check if Docker is installed
if ! [ -x "$(command -v docker)" ]; then
  echo -e "${RED}Error: docker is not installed.${NC}" >&2
  exit 1
fi

# 3. Check if Docker Compose is installed
if ! [ -x "$(command -v docker-compose)" ]; then
  echo -e "${RED}Error: docker-compose is not installed.${NC}" >&2
  exit 1
fi

# 4. Check for .env.local file
if [ ! -f .env.local ]; then
  echo -e "${RED}Error: .env.local file not found!${NC}"
  echo -e "${YELLOW}Please create .env.local with your Telegram and SMTP secrets before running this script.${NC}"
  exit 1
fi

# 5. Create necessary directories for persistence
echo -e "${GREEN}Preparing directories...${NC}"
mkdir -p public/uploads

# 6. Ensure sqlite database file exists for volume mounting
if [ ! -f prim_uslugi.db ]; then
  echo -e "${YELLOW}Creating empty prim_uslugi.db file...${NC}"
  touch prim_uslugi.db
  chmod 666 prim_uslugi.db
fi

# 7. Build and start containers
echo -e "${GREEN}Building and starting Docker containers...${NC}"
docker-compose down # Stop existing containers if any
docker-compose up -d --build

# 8. Check status
if [ $? -eq 0 ]; then
  echo -e "${GREEN}====================================================${NC}"
  echo -e "${GREEN}Deployment Successful!${NC}"
  echo -e "${GREEN}The app is running on port 3005.${NC}"
  echo -e "${GREEN}Domain: primuslugi.ruslandev.uz${NC}"
  echo -e "${GREEN}====================================================${NC}"
  echo -e "${YELLOW}Next steps:${NC}"
  echo -e "1. Ensure Nginx is configured (see nginx.conf.example)."
  echo -e "2. Check logs if needed: docker-compose logs -f"
else
  echo -e "${RED}Deployment failed. Please check the errors above.${NC}"
  exit 1
fi
