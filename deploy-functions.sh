#!/bin/bash

# Supabase Edge Functions Deployment Script
# Deploys all 4 Edge Functions for the AAC app

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="seoxgqnatjmxcnxzzumc"
FUNCTIONS=("cards" "categories" "usage-log" "stats")

echo -e "${YELLOW}Supabase Edge Functions Deployment${NC}"
echo "======================================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI is not installed${NC}"
    echo "Install with: npm install -g supabase"
    exit 1
fi

echo -e "${GREEN}✓ Supabase CLI found${NC}"

# Check if user is logged in
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo -e "${YELLOW}No access token found. Please login:${NC}"
    supabase login
    if [ $? -ne 0 ]; then
        echo -e "${RED}Login failed. Exiting.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Access token found${NC}"
fi

# Link project if needed
echo ""
echo -e "${YELLOW}Linking to project ${PROJECT_ID}...${NC}"
supabase link --project-ref "$PROJECT_ID" 2>/dev/null || true

# Deploy all functions
echo ""
echo -e "${YELLOW}Deploying Edge Functions...${NC}"
echo ""

for func in "${FUNCTIONS[@]}"; do
    echo -e "${YELLOW}Deploying ${func}...${NC}"
    if supabase functions deploy "$func"; then
        echo -e "${GREEN}✓ ${func} deployed successfully${NC}"
    else
        echo -e "${RED}✗ Failed to deploy ${func}${NC}"
        exit 1
    fi
    echo ""
done

# List deployed functions
echo -e "${YELLOW}Verifying deployment...${NC}"
echo ""
supabase functions list

echo ""
echo -e "${GREEN}======================================"
echo "Deployment completed successfully!"
echo "=====================================${NC}"
echo ""
echo "Your functions are now available at:"
echo "  • https://${PROJECT_ID}.supabase.co/functions/v1/cards"
echo "  • https://${PROJECT_ID}.supabase.co/functions/v1/categories"
echo "  • https://${PROJECT_ID}.supabase.co/functions/v1/usage-log"
echo "  • https://${PROJECT_ID}.supabase.co/functions/v1/stats"
echo ""
echo "Test with: curl https://${PROJECT_ID}.supabase.co/functions/v1/cards"
