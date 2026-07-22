#!/usr/bin/env bash

# =================================================================
# 🚀 1-Line Auto Quick Setup Script - LTLX Discord Bot (600 câu B2)
# Supported Environments: macOS / Linux / Termux (Android)
# Usage:
#   bash <(curl -sSL https://raw.githubusercontent.com/thucho0103/ltlx-bot/main/setup.sh)
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

# Helper function to read user input from TTY (supports curl | bash piping)
prompt_read() {
    local prompt_msg="$1"
    local var_name="$2"
    if [ -c /dev/tty ]; then
        read -p "$prompt_msg" "$var_name" < /dev/tty
    else
        read -p "$prompt_msg" "$var_name"
    fi
}

# 1. Check & Install Git & Node.js for Termux / Linux / macOS
if [ "$ENV_TYPE" = "Termux" ]; then
    echo -e "${YELLOW}Checking dependencies for Termux...${NC}"
    pkg update -y || true
    if ! command -v git &> /dev/null || ! command -v node &> /dev/null; then
        echo -e "${YELLOW}Installing Node.js & Git via Termux pkg...${NC}"
        pkg install -y nodejs-lts git
    fi
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed.${NC}"
    echo -e "${YELLOW}Please install Node.js (v16+) from https://nodejs.org/ and re-run setup.sh${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version:${NC} $(node -v)"

# 2. Check working directory, clone repo if run directly outside repo
if [ ! -f "package.json" ] || ! grep -q "ltlx-discord-bot" package.json 2>/dev/null; then
    echo -e "\n${BLUE}📥 Cloning repository from GitHub...${NC}"
    if [ -d "ltlx-bot" ]; then
        cd ltlx-bot
    else
        git clone https://github.com/thucho0103/ltlx-bot.git
        cd ltlx-bot
    fi
fi

# 3. Install NPM Dependencies
echo -e "\n${BLUE}📦 Installing npm dependencies...${NC}"
npm install

# 4. Setup .env file
echo -e "\n${BLUE}⚙️ Configuring Environment (.env)...${NC}"
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
    else
        touch .env
    fi

    echo -e "${YELLOW}Please enter your Discord Bot credentials:${NC}"
    
    prompt_read "🔑 Enter DISCORD_TOKEN: " input_token
    prompt_read "🆔 Enter CLIENT_ID: " input_client_id
    prompt_read "🏰 Enter GUILD_ID (Optional - press Enter to skip): " input_guild_id
    prompt_read "💬 Enter LIVE_CHANNEL_ID (Optional - press Enter to skip): " input_channel_id

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

# 5. Register Slash Commands
echo -e "\n${BLUE}🤖 Registering Discord Slash Commands...${NC}"
npm run register

echo -e "\n${GREEN}=====================================================${NC}"
echo -e "${GREEN} 🎉 QUICK SETUP COMPLETED SUCCESSFULLY! ${NC}"
echo -e "${GREEN}=====================================================${NC}"
echo -e "To start the bot anytime, run: ${YELLOW}npm start${NC} inside $(pwd)\n"

prompt_read "🚀 Do you want to start the bot now? (y/N): " start_now
if [[ "$start_now" =~ ^[Yy]$ ]]; then
    npm start
fi
