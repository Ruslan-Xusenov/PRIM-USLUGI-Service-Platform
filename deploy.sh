RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}>>> Starting update check for Prim-Uslugi...${NC}"

for cmd in git docker docker-compose; do
  if ! [ -x "$(command -v $cmd)" ]; then
    echo -e "${RED}Error: $cmd is not installed.${NC}" >&2
    exit 1
  fi
done

if [ ! -f .env.local ]; then
  echo -e "${RED}Error: .env.local file not found!${NC}"
  echo -e "${YELLOW}Please create .env.local with secrets before running this script.${NC}"
  exit 1
fi

echo -e "${YELLOW}Checking for updates on GitHub...${NC}"
git fetch origin main

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    echo -e "${GREEN}System is already up to date (Version: $LOCAL).${NC}"
    
    if [ ! "$(docker ps -q -f name=prim-uslugi-web)" ]; then
        echo -e "${YELLOW}Application container is not running. Starting it now...${NC}"
        docker-compose up -d
    else
        echo -e "${GREEN}Application is already running and healthy.${NC}"
        exit 0
    fi
else
    echo -e "${YELLOW}Update detected! Pulling new version...${NC}"
    git pull origin main
    
    echo -e "${GREEN}Syncing configuration...${NC}"
    mkdir -p public/uploads
    if [ ! -f prim_uslugi.db ]; then
        touch prim_uslugi.db
        chmod 666 prim_uslugi.db
    fi

    echo -e "${GREEN}Building and deploying new version...${NC}"
    docker-compose up -d --build
    if [ $? -eq 0 ]; then
        # Wait for container to settle
        echo -e "${YELLOW}Giving the container a moment to settle...${NC}"
        sleep 2
        
        # Fix permissions on the host file
        if [ -f "prim_uslugi.db" ]; then
            chmod 666 prim_uslugi.db
        fi

        # Database seeding is now automatically handled by Next.js inside src/lib/db.js
        echo -e "${YELLOW}Database is self-seeding on startup...${NC}"

        echo -e "${GREEN}====================================================${NC}"
        echo -e "${GREEN}Update Successful!${NC}"
        echo -e "${GREEN}New Version: $(git rev-parse HEAD)${NC}"
        echo -e "${GREEN}The app is running on port 3005.${NC}"
        echo -e "${GREEN}====================================================${NC}"
        
    else
        echo -e "${RED}Deployment failed. Please check logs with: docker-compose logs${NC}"
        exit 1
    fi
fi