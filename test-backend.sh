#!/bin/bash

# Backend API Testing Script
# This script tests all backend endpoints

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SUPABASE_URL="${EXPO_PUBLIC_SUPABASE_URL}"
ANON_KEY="${EXPO_PUBLIC_SUPABASE_ANON_KEY}"

if [ -z "$SUPABASE_URL" ] || [ -z "$ANON_KEY" ]; then
  echo -e "${RED}Error: Missing environment variables${NC}"
  echo "Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY"
  exit 1
fi

BASE_URL="${SUPABASE_URL}/functions/v1"

echo -e "${BLUE}=== AAC App Backend API Tests ===${NC}\n"

# Test 1: GET /categories
echo -e "${BLUE}Test 1: GET /categories${NC}"
curl -s "$BASE_URL/categories" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed"
echo -e "\n"

# Test 2: GET /cards
echo -e "${BLUE}Test 2: GET /cards${NC}"
curl -s "$BASE_URL/cards" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed"
echo -e "\n"

# Test 3: GET /cards with category filter
echo -e "${BLUE}Test 3: GET /cards?category_id=emotions${NC}"
curl -s "$BASE_URL/cards?category_id=emotions" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed"
echo -e "\n"

# Test 4: POST /usage-log
echo -e "${BLUE}Test 4: POST /usage-log${NC}"
FIRST_CARD=$(curl -s "$BASE_URL/cards" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" | jq -r '.[0].id' 2>/dev/null)

if [ ! -z "$FIRST_CARD" ] && [ "$FIRST_CARD" != "null" ]; then
  curl -s -X POST "$BASE_URL/usage-log" \
    -H "Authorization: Bearer $ANON_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"card_id\": \"$FIRST_CARD\"}" | jq '.'
else
  echo "Could not find a card to test with"
fi
echo -e "\n"

# Test 5: GET /stats
echo -e "${BLUE}Test 5: GET /stats${NC}"
curl -s "$BASE_URL/stats" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed"
echo -e "\n"

echo -e "${GREEN}=== Tests Complete ===${NC}"
