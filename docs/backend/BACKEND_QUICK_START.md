# Backend Quick Start

## What Was Created?

A complete backend system using **Supabase Edge Functions** with 4 API endpoints:

1. **GET /cards** - Retrieve communication cards
2. **GET /categories** - Retrieve card categories
3. **POST /usage-log** - Log card usage
4. **GET /stats** - Get usage statistics

## Files Added

```
supabase/functions/
├── _shared/cors.ts          # CORS headers configuration
├── cards/index.ts           # GET /cards endpoint
├── categories/index.ts      # GET /categories endpoint
├── usage-log/index.ts       # POST /usage-log endpoint
└── stats/index.ts           # GET /stats endpoint

lib/
└── api.ts                   # Frontend API service

Documentation:
├── BACKEND.md               # API endpoint documentation
├── BACKEND_SETUP.md         # Detailed setup guide
└── test-backend.sh          # API testing script
```

## Quick Setup

### 1. Deploy Functions

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Deploy to your Supabase project
supabase functions deploy
```

### 2. Test the API

```bash
# Make sure environment variables are set
export EXPO_PUBLIC_SUPABASE_URL="your_supabase_url"
export EXPO_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"

# Run tests
./test-backend.sh
```

### 3. Use in App

```typescript
import { api } from '@/lib/api';

// Get all categories
const categories = await api.getCategories();

// Get cards for a category
const cards = await api.getCards('emotions');

// Log when user uses a card
await api.logUsage('card_id');

// Get usage statistics
const stats = await api.getStats();
```

## API Base URL

All endpoints are available at:

```
{SUPABASE_URL}/functions/v1/{endpoint}
```

Example:
```
https://your-project.supabase.co/functions/v1/cards
https://your-project.supabase.co/functions/v1/categories
https://your-project.supabase.co/functions/v1/usage-log
https://your-project.supabase.co/functions/v1/stats
```

## Authentication

Include the Supabase anon key in all requests:

```javascript
const headers = {
  'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};
```

## Features

✓ Full CORS support for frontend requests
✓ Automatic error handling
✓ TypeScript type safety
✓ Input validation
✓ Proper HTTP status codes
✓ ISO 8601 timestamps
✓ Database indexing ready
✓ No external API dependencies

## Next Steps

1. [Deploy functions to Supabase](#quick-setup)
2. [Read API documentation](./BACKEND.md)
3. [Review setup guide](./BACKEND_SETUP.md)
4. [Test endpoints](./test-backend.sh)
5. Integrate API service in app screens

## Troubleshooting

**Functions not deploying?**
- Ensure Supabase CLI is installed: `supabase --version`
- Check authentication: `supabase projects list`
- Review logs: `supabase functions list`

**API returning errors?**
- Verify environment variables are set
- Check Supabase dashboard for function logs
- Run `./test-backend.sh` to diagnose

**CORS issues?**
- All endpoints include proper CORS headers
- Frontend requests should include Authorization header

## Support Files

- **BACKEND.md** - Full API documentation
- **BACKEND_SETUP.md** - Advanced setup and debugging
- **test-backend.sh** - Automated API tests
- **lib/api.ts** - Frontend service integration
