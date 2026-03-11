# Supabase Edge Functions Deployment Guide

This document provides instructions for deploying the 4 Edge Functions for the AAC (Augmentative and Alternative Communication) app.

## Prerequisites

- Supabase CLI installed (`npm install -g supabase` or use package manager)
- Supabase access token (obtain from https://app.supabase.com/account/tokens)
- Project ID: `seoxgqnatjmxcnxzzumc`

## Functions Overview

### 1. GET /cards
**Endpoint:** `https://seoxgqnatjmxcnxzzumc.supabase.co/functions/v1/cards`

Returns all cards with optional category filtering.

**Query Parameters:**
- `category_id` (optional): Filter cards by category ID

**Response:**
```json
[
  {
    "id": "card-uuid",
    "title": "Card Title",
    "category_id": "category-uuid",
    "image_url": "https://...",
    "order_index": 1
  }
]
```

### 2. GET /categories
**Endpoint:** `https://seoxgqnatjmxcnxzzumc.supabase.co/functions/v1/categories`

Returns all categories ordered by `order_index`.

**Response:**
```json
[
  {
    "id": "category-uuid",
    "name": "Category Name",
    "order_index": 1
  }
]
```

### 3. POST /usage-log
**Endpoint:** `https://seoxgqnatjmxcnxzzumc.supabase.co/functions/v1/usage-log`

Logs card usage to track user interactions.

**Request Body:**
```json
{
  "card_id": "card-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usage logged successfully",
  "data": {
    "id": "log-uuid",
    "card_id": "card-uuid",
    "timestamp": "2026-03-11T07:06:17.463Z"
  }
}
```

### 4. GET /stats
**Endpoint:** `https://seoxgqnatjmxcnxzzumc.supabase.co/functions/v1/stats`

Returns usage statistics for the app.

**Response:**
```json
{
  "total_cards_used": 150,
  "unique_cards": 45,
  "total_sessions": 12,
  "top_cards": [
    {
      "card_id": "card-uuid",
      "usage_count": 15
    }
  ]
}
```

## Deployment Steps

### Option 1: Using Supabase CLI (Recommended)

1. **Login to Supabase:**
   ```bash
   supabase login
   ```

2. **Link your project:**
   ```bash
   supabase link --project-ref seoxgqnatjmxcnxzzumc
   ```

3. **Deploy all functions:**
   ```bash
   supabase functions deploy
   ```

   Or deploy individual functions:
   ```bash
   supabase functions deploy cards
   supabase functions deploy categories
   supabase functions deploy usage-log
   supabase functions deploy stats
   ```

4. **Verify deployment:**
   ```bash
   supabase functions list
   ```

### Option 2: Using Environment Variable (Non-Interactive)

1. **Set your access token:**
   ```bash
   export SUPABASE_ACCESS_TOKEN="your-access-token"
   ```

2. **Deploy functions:**
   ```bash
   supabase functions deploy --project-ref seoxgqnatjmxcnxzzumc
   ```

## Function Details

### cards/index.ts
- **Type:** GET
- **Accepts:** Query parameters for filtering
- **Database:** Reads from `cards` table
- **Features:**
  - Category filtering via `category_id` query param
  - Returns cards ordered by `order_index`
  - Full error handling and CORS support

### categories/index.ts
- **Type:** GET
- **Database:** Reads from `categories` table
- **Features:**
  - Returns all categories
  - Ordered by `order_index`
  - Full error handling and CORS support

### usage-log/index.ts
- **Type:** POST
- **Database:** Writes to `usage_logs` table
- **Features:**
  - Validates required `card_id` field
  - Auto-generates timestamp
  - Returns created log entry
  - Full error handling and CORS support

### stats/index.ts
- **Type:** GET
- **Database:** Reads from `usage_logs` table
- **Features:**
  - Calculates total usage count
  - Counts unique cards used
  - Counts unique session days
  - Returns top 10 most-used cards
  - Full error handling and CORS support

## CORS Headers

All functions include the following CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Client-Info, Apikey
```

## Testing

Once deployed, you can test the functions using curl:

```bash
# Test GET /cards
curl -X GET "https://seoxgqnatjmxcnxzzumc.supabase.co/functions/v1/cards"

# Test GET /cards with category filter
curl -X GET "https://seoxgqnatjmxcnxzzumc.supabase.co/functions/v1/cards?category_id=your-category-id"

# Test GET /categories
curl -X GET "https://seoxgqnatjmxcnxzzumc.supabase.co/functions/v1/categories"

# Test POST /usage-log
curl -X POST "https://seoxgqnatjmxcnxzzumc.supabase.co/functions/v1/usage-log" \
  -H "Content-Type: application/json" \
  -d '{"card_id":"your-card-id"}'

# Test GET /stats
curl -X GET "https://seoxgqnatjmxcnxzzumc.supabase.co/functions/v1/stats"
```

## Environment Variables

The functions use the following environment variables (automatically provided by Supabase):
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for server-side operations

## Error Handling

All functions include comprehensive error handling:
- Missing configuration returns 500 status with error message
- Database errors return 500 status with error message
- Invalid requests return 400/405 status with error message
- All errors are logged to the Supabase function logs

## File Structure

```
supabase/
├── functions/
│   ├── _shared/
│   │   └── cors.ts          # Shared CORS headers
│   ├── cards/
│   │   └── index.ts         # GET /cards function
│   ├── categories/
│   │   └── index.ts         # GET /categories function
│   ├── usage-log/
│   │   └── index.ts         # POST /usage-log function
│   └── stats/
│       └── index.ts         # GET /stats function
└── migrations/              # Database migrations
```

## Troubleshooting

### Functions not appearing after deployment
- Check that the Supabase CLI is linked to the correct project
- Verify that `supabase.json` has the correct project ID
- Check the Supabase dashboard under Edge Functions

### CORS errors when testing
- Verify the function includes proper CORS headers
- Check browser console for specific CORS error messages
- Ensure the request includes proper headers

### Database connection errors
- Verify that the `cards`, `categories`, and `usage_logs` tables exist
- Check that the SERVICE_ROLE_KEY has proper permissions
- Review function logs in the Supabase dashboard

### Missing data in responses
- Verify that the tables have data
- Check that column names match the query (case-sensitive in some databases)
- Review function logs for SQL error messages
