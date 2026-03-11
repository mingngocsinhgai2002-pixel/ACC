# AAC App Backend System

## Overview

Complete backend system built with **Supabase Edge Functions** for the AAC (Augmentative and Alternative Communication) application.

## What's Included

### API Endpoints (4 Functions)

1. **GET /cards** - Retrieve communication cards with optional category filtering
2. **GET /categories** - Retrieve all communication categories
3. **POST /usage-log** - Log when users interact with cards for analytics
4. **GET /stats** - Get usage statistics and trending cards

### Backend Files

```
supabase/functions/
├── _shared/
│   └── cors.ts              # CORS configuration
├── cards/
│   └── index.ts             # Cards endpoint
├── categories/
│   └── index.ts             # Categories endpoint
├── usage-log/
│   └── index.ts             # Usage logging
└── stats/
    └── index.ts             # Statistics endpoint

lib/
└── api.ts                   # Frontend API client

Documentation:
├── BACKEND_README.md        # This file
├── BACKEND_QUICK_START.md   # Quick start guide
├── BACKEND.md               # API documentation
├── BACKEND_SETUP.md         # Detailed setup guide
└── DEPLOY_FUNCTIONS.md      # Deployment instructions

Scripts:
├── deploy.sh                # Automated deployment script
└── test-backend.sh          # API testing script
```

## Quick Start

### 1. Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Linux/Windows
# Visit: https://supabase.com/docs/guides/cli
```

### 2. Deploy Functions

```bash
# Option A: Using deployment script
./deploy.sh

# Option B: Manual deployment
supabase login
supabase link --project-ref your_project_id
supabase functions deploy
```

### 3. Verify Deployment

```bash
./test-backend.sh
```

### 4. Use in App

```typescript
import { api } from '@/lib/api';

// Get categories
const categories = await api.getCategories();

// Get cards
const cards = await api.getCards();

// Log usage
await api.logUsage('card_id');

// Get stats
const stats = await api.getStats();
```

## API Documentation

### GET /cards

Retrieve communication cards.

**Query Parameters:**
- `category_id` (optional): Filter by category

**Response:**
```json
[
  {
    "id": "string",
    "category_id": "string",
    "title": "string",
    "image_url": "string",
    "audio_url": "string | null",
    "is_custom": boolean,
    "order_index": number,
    "created_at": "string",
    "updated_at": "string"
  }
]
```

---

### GET /categories

Retrieve all categories.

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "icon": "string",
    "color": "string",
    "order_index": number,
    "created_at": "string"
  }
]
```

---

### POST /usage-log

Log card usage for analytics.

**Request:**
```json
{
  "card_id": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usage logged successfully",
  "data": {
    "id": "string",
    "card_id": "string",
    "used_at": "string",
    "session_id": "string | null"
  }
}
```

---

### GET /stats

Get usage statistics.

**Response:**
```json
{
  "total_cards_used": number,
  "unique_cards": number,
  "total_sessions": number,
  "top_cards": [
    {
      "card_id": "string",
      "usage_count": number
    }
  ]
}
```

---

## Environment Configuration

### Required Environment Variables

Set these in your `.env` file:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Supabase Automatically Provides

Edge functions have automatic access to:
- `SUPABASE_URL` - Project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Admin API key

No additional configuration needed!

## Project Setup Steps

1. **Create Supabase Project**
   - Visit: https://app.supabase.com
   - Create a new project

2. **Get Project Credentials**
   - Settings → General
   - Copy Project URL and Anon Key
   - Add to `.env` file

3. **Initialize Database**
   - The migrations are already in `supabase/migrations/`
   - They're applied automatically when you link the project

4. **Deploy Functions**
   - Run: `./deploy.sh`
   - Or: `supabase functions deploy`

5. **Test Everything**
   - Run: `./test-backend.sh`

6. **Update Frontend**
   - The `lib/api.ts` service is ready to use
   - Import and use in your components

## Frontend Integration

### Using the API Service

```typescript
import { api } from '@/lib/api';

// In your component
useEffect(() => {
  async function loadData() {
    const categories = await api.getCategories();
    setCategories(categories);

    const cards = await api.getCards(selectedCategory);
    setCards(cards);
  }

  loadData();
}, [selectedCategory]);

// Log when user taps a card
const handleCardPress = async (card) => {
  await api.logUsage(card.id);
};

// Get stats for dashboard
const stats = await api.getStats();
```

## Security

- CORS headers configured for frontend requests
- Service role key used only in edge functions (secure)
- Input validation on all endpoints
- Proper HTTP status codes for all scenarios
- No sensitive data exposed to client

## Troubleshooting

### Functions not deploying?

1. Install Supabase CLI: `https://supabase.com/docs/guides/cli`
2. Login: `supabase login`
3. Link project: `supabase link --project-ref your_id`
4. Deploy: `supabase functions deploy`

### API returning 500 errors?

1. Check function logs: `supabase functions list`
2. Verify environment variables in Supabase dashboard
3. Check database tables exist in Supabase SQL editor

### CORS errors?

- All endpoints include CORS headers
- Ensure `Authorization` header includes anon key
- Browser will show CORS errors in console

### Test script not working?

1. Set environment variables: `export EXPO_PUBLIC_SUPABASE_URL="your_url"`
2. Run: `./test-backend.sh`
3. Check curl output for detailed errors

## Documentation Files

- **BACKEND_QUICK_START.md** - Get started in 5 minutes
- **BACKEND.md** - Complete API reference
- **BACKEND_SETUP.md** - Advanced setup and debugging
- **DEPLOY_FUNCTIONS.md** - Deployment instructions

## Scripts

- **deploy.sh** - Deploy all functions with one command
- **test-backend.sh** - Test all API endpoints

## Next Steps

1. Deploy the functions using `./deploy.sh`
2. Run tests with `./test-backend.sh`
3. Integrate APIs into app screens
4. Monitor usage statistics
5. Customize as needed

## Support

- Supabase Docs: https://supabase.com/docs
- Edge Functions: https://supabase.com/docs/guides/functions
- API Reference: https://supabase.com/docs/reference/javascript

---

**Status:** Ready to deploy ✓
**Functions:** 4 APIs ready
**Documentation:** Complete
**Testing:** Automated scripts included
