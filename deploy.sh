#!/bin/bash

# Deploy Supabase Edge Functions
# This script deploys all edge functions to your Supabase project

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}=== Supabase Edge Functions Deployment ===${NC}\n"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI not found${NC}"
    echo -e "${YELLOW}Install it from: https://supabase.com/docs/guides/cli${NC}"
    echo ""
    echo "Quick install options:"
    echo "  macOS (Homebrew):  brew install supabase/tap/supabase"
    echo "  Linux (Scoop):     scoop install supabase"
    echo "  Windows (Scoop):   scoop install supabase"
    echo "  Or via npm:        npm install -g supabase"
    exit 1
fi

# Check if authenticated
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}Not authenticated. Running: supabase login${NC}"
    supabase login
fi

# Check if project is linked
if [ ! -f ".supabase/config.toml" ]; then
    echo -e "${YELLOW}Project not linked. Please run:${NC}"
    echo "  supabase link --project-ref your_project_id"
    echo ""
    echo "To find your project ID:"
    echo "  1. Go to: https://app.supabase.com"
    echo "  2. Select your project"
    echo "  3. Go to: Settings → General → Project ID"
    exit 1
fi

echo -e "${BLUE}Deploying edge functions...${NC}\n"

# Deploy each function
echo -e "${BLUE}1. Deploying: cards${NC}"
supabase functions deploy cards && echo -e "${GREEN}✓ cards deployed${NC}\n" || echo -e "${RED}✗ cards failed${NC}\n"

echo -e "${BLUE}2. Deploying: categories${NC}"
supabase functions deploy categories && echo -e "${GREEN}✓ categories deployed${NC}\n" || echo -e "${RED}✗ categories failed${NC}\n"

echo -e "${BLUE}3. Deploying: usage-log${NC}"
supabase functions deploy usage-log && echo -e "${GREEN}✓ usage-log deployed${NC}\n" || echo -e "${RED}✗ usage-log failed${NC}\n"

echo -e "${BLUE}4. Deploying: stats${NC}"
supabase functions deploy stats && echo -e "${GREEN}✓ stats deployed${NC}\n" || echo -e "${RED}✗ stats failed${NC}\n"

echo -e "${BLUE}=== Deployment Complete ===${NC}\n"

echo -e "${GREEN}Functions deployed successfully!${NC}\n"

echo "List deployed functions:"
supabase functions list

echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Run tests: ./test-backend.sh"
echo "2. Check logs: supabase functions list --json"
echo "3. View function: supabase functions describe {function-name}"
echo ""
echo "API endpoints are available at:"
echo "  https://your-project.supabase.co/functions/v1/cards"
echo "  https://your-project.supabase.co/functions/v1/categories"
echo "  https://your-project.supabase.co/functions/v1/usage-log"
echo "  https://your-project.supabase.co/functions/v1/stats"
