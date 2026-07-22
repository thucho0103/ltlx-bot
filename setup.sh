#!/usr/bin/env bash

# =================================================================
# 🚀 Auto Quick Setup Script - LTLX Discord Bot (600 câu hỏi B2)
# Supported Environments: macOS / Linux / Termux (Android)
# =================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================================${NC}"
echo -e "${GREEN} 🚗 LTLX DISCORD BOT - AUTOMATED QUICK SETUP ${NC}"
echo -e "${BLUE}=====================================================${NC}"

# Detect Environment
OS_NAME="$(uname -s)"
case "${OS_NAME}" in
    Linux*)     
        if [ -d "/data/data/com.termux/files/usr" ]; then
            ENV_TYPE="Termux"
        else
            ENV_TYPE="Linux"
        fi
        ;;
    Darwin*)    ENV_TYPE="macOS";;
    *)          ENV_TYPE="Unknown";;
esac

echo -e "${YELLOW}📌 Detected environment:${NC} ${GREEN}${ENV_TYPE}${NC}"

# 1. Check Node.js & Git
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed.${NC}"
    if [ "$ENV_TYPE" = "Termux" ]; then
        echo -e "${YELLOW}Installing Node.js & Git via Termux pkg...${NC}"
        pkg update && pkg install -y nodejs-lts git
    else
        echo -e "${YELLOW}Please install Node.js (v16+) from https://nodejs.org/ and re-run setup.sh${NC}"
        exit 1
    fi
else
    NODE_VER="$(node -v)"
    echo -e "${GREEN}✅ Node.js version:${NC} ${NODE_VER}"
fi

# 2. Install NPM Dependencies
echo -e "\n${BLUE}📦 Installing npm dependencies...${NC}"
npm install

# 3. Setup .env file
echo -e "\n${BLUE}⚙️ Configuring Environment (.env)...${NC}"
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
    else
        touch .env
    fi

    echo -e "${YELLOW}Please enter your Discord Bot credentials:${NC}"
    
    read -p "🔑 Enter DISCORD_TOKEN: " input_token
    read -p "🆔 Enter CLIENT_ID: " input_client_id
    read -p "🏰 Enter GUILD_ID (Optional - press Enter to skip): " input_guild_id
    read -p "💬 Enter LIVE_CHANNEL_ID (Optional - press Enter to skip): " input_channel_id

    cat <<EOF > .env
DISCORD_TOKEN=${input_token}
CLIENT_ID=${input_client_id}
GUILD_ID=${input_guild_id}
LIVE_CHANNEL_ID=${input_channel_id}
EOF
    echo -e "${GREEN}✅ Created .env file successfully!${NC}"
else
    echo -e "${GREEN}✅ Existing .env file found.${NC}"
fi

# 4. Register Slash Commands
echo -e "\n${BLUE}🤖 Registering Discord Slash Commands...${NC}"
npm run register

echo -e "\n${GREEN}=====================================================${NC}"
echo -e "${GREEN} 🎉 QUICK SETUP COMPLETED SUCCESSFULLY! ${NC}"
echo -e "${GREEN}=====================================================${NC}"
echo -e "To start the bot anytime, run: ${YELLOW}npm start${NC}\n"

read -p "🚀 Do you want to start the bot now? (y/N): " start_now
if [[ "$start_now" =~ ^[Yy]$ ]]; then
    npm start
fi
