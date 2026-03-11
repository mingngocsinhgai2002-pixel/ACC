# Backend Setup Guide

## Overview

This project uses **Supabase Edge Functions** for backend API operations. These are serverless functions that run in Deno runtime.

## Project Structure

```
supabase/
├── functions/
│   ├── _shared/
│   │   └── cors.ts           # Shared CORS configuration
│   ├── cards/
│   │   └── index.ts          # GET /cards endpoint
│   ├── categories/
│   │   └── index.ts          # GET /categories endpoint
│   ├── usage-log/
│   │   └── index.ts          # POST /usage-log endpoint
│   └── stats/
│       └── index.ts          # GET /stats endpoint
└── migrations/
    └── 20260202023506_create_aac_app_schema.sql

lib/
├── supabase.ts               # Supabase client setup
└── api.ts                    # API service for frontend
```

## Functions

### 1. Cards Function (`supabase/functions/cards/`)

**Purpose:** Retrieve communication cards

**Methods:** GET

**Query Parameters:**
- `category_id` (optional): Filter by category

**Features:**
- Supports filtering by category
- Returns cards ordered by display index
- Full error handling with proper HTTP status codes

---

### 2. Categories Function (`supabase/functions/categories/`)

**Purpose:** Retrieve communication categories

**Methods:** GET

**Features:**
- Returns all categories
- Ordered by display priority
- Includes category icons and colors

---

### 3. Usage Log Function (`supabase/functions/usage-log/`)

**Purpose:** Log when users interact with cards

**Methods:** POST

**Request Body:**
```json
{
  "card_id": "string"
}
```

**Features:**
- Validates required fields
- Automatically timestamps logs
- Returns created entry for confirmation

---

### 4. Stats Function (`supabase/functions/stats/`)

**Purpose:** Calculate usage statistics

**Methods:** GET

**Response Includes:**
- Total cards used
- Unique cards used
- Total sessions
- Top 10 most used cards

---

## Environment Variables

### Development (.env)

```
# Supabase Configuration (Auto-populated in Supabase)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Supabase Secrets

Edge functions automatically have access to:
- `SUPABASE_URL` - Project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Admin key for database operations

**No additional configuration needed!** Supabase automatically injects these variables.

---

## Deploying Functions

### Prerequisites

1. Supabase CLI installed: `npm install -g supabase`
2. Authenticated with Supabase: `supabase login`

### Deploy All Functions

```bash
supabase functions deploy
```

### Deploy Specific Function

```bash
supabase functions deploy cards
supabase functions deploy categories
supabase functions deploy usage-log
supabase functions deploy stats
```

### Test Functions Locally

```bash
# Start local Supabase
supabase start

# Deploy to local environment
supabase functions deploy --local

# View logs
supabase functions list
```

---

## API Integration

### Using the API Service

```typescript
import { api } from '@/lib/api';

// Fetch categories
const categories = await api.getCategories();

// Fetch cards for a category
const cards = await api.getCards('emotions');

// Log card usage
await api.logUsage('card_id_123');

// Get statistics
const stats = await api.getStats();
```

### Direct API Calls

All endpoints are available at:
```
{SUPABASE_URL}/functions/v1/{function-name}
```

Example:
```typescript
const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cards`,
  {
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  }
);
const data = await response.json();
```

---

## CORS Configuration

All functions include proper CORS headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Client-Info, Apikey
```

This allows frontend requests from any origin during development.

---

## Error Handling

All functions follow standard HTTP status codes:

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Created (usage-log) |
| 400 | Bad Request |
| 405 | Method Not Allowed |
| 500 | Server Error |

### Error Response Format

```json
{
  "error": "Description of what went wrong"
}
```

---

## Database Queries

Functions use Supabase JavaScript client for database operations:

```typescript
import { createClient } from "npm:@supabase/supabase-js";

const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch data
const { data, error } = await supabase
  .from("table_name")
  .select("*");

// Insert data
const { data, error } = await supabase
  .from("table_name")
  .insert([{ field: "value" }])
  .select();
```

---

## Monitoring & Debugging

### View Function Logs

```bash
supabase functions list
supabase functions describe {function-name}
```

### Common Issues

**1. Missing Environment Variables**
- Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are accessible
- Check Supabase project settings

**2. CORS Errors**
- Ensure corsHeaders are properly applied to all responses
- Options request must return 200 status

**3. Database Connection Errors**
- Verify database tables exist
- Check RLS policies allow service role access
- Review database schema in migrations

---

## Best Practices

1. **Always validate input** - Check required fields and types
2. **Handle errors gracefully** - Use try/catch blocks
3. **Include CORS headers** - Required for all responses
4. **Log operations** - Use console.error for debugging
5. **Use appropriate HTTP status codes** - Follow REST conventions
6. **Timestamp all operations** - For audit trails

---

## Testing

### Unit Test Example

```typescript
// Test GET /cards endpoint
const response = await fetch(
  'http://localhost:54321/functions/v1/cards'
);
const cards = await response.json();

console.log('Cards:', cards);
```

### Integration with Frontend

The frontend app uses the `api` service to communicate with backend:

```typescript
// In app screens
import { api } from '@/lib/api';

useEffect(() => {
  async function loadData() {
    const categories = await api.getCategories();
    const cards = await api.getCards(selectedCategory);
  }
  loadData();
}, []);
```

---

## Next Steps

1. Configure environment variables in `.env`
2. Run `supabase functions deploy` to publish functions
3. Test endpoints using provided examples
4. Integrate API service into app screens
5. Monitor logs in Supabase dashboard

---

## Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Manual](https://deno.land/manual)
- [REST API Best Practices](https://restfulapi.net/)
