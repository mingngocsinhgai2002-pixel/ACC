# Backend API Documentation

## Overview

The AAC (Augmentative and Alternative Communication) app includes Supabase Edge Functions for handling data operations.

## API Endpoints

All endpoints are hosted at: `{SUPABASE_URL}/functions/v1/`

### 1. GET /cards

Retrieve all communication cards, optionally filtered by category.

**Query Parameters:**
- `category_id` (optional): Filter cards by category ID

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

**Example:**
```bash
# Get all cards
curl https://your-supabase-url/functions/v1/cards

# Get cards from a specific category
curl https://your-supabase-url/functions/v1/cards?category_id=emotions
```

---

### 2. GET /categories

Retrieve all categories ordered by display priority.

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

**Example:**
```bash
curl https://your-supabase-url/functions/v1/categories
```

---

### 3. POST /usage-log

Log when a user uses a communication card. This helps track usage patterns and frequency.

**Request Body:**
```json
{
  "card_id": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "card_id": "string",
  "used_at": "string (ISO 8601)",
  "session_id": "string | null"
}
```

**Example:**
```bash
curl -X POST https://your-supabase-url/functions/v1/usage-log \
  -H "Content-Type: application/json" \
  -d '{"card_id": "card_123"}'
```

---

### 4. GET /stats

Retrieve usage statistics for the application.

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

**Example:**
```bash
curl https://your-supabase-url/functions/v1/stats
```

---

## Using APIs in Frontend

The app provides an `api` service for easy integration:

```typescript
import { api } from '@/lib/api';

// Get all categories
const categories = await api.getCategories();

// Get cards for a category
const cards = await api.getCards('emotions');

// Log card usage
await api.logUsage('card_123');

// Get statistics
const stats = await api.getStats();
```

---

## Environment Variables

Required environment variables (set in `.env`):

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## Deploying Functions

To deploy or update edge functions:

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy cards
```

---

## Security

- All endpoints include CORS headers for cross-origin requests
- Functions use Supabase's SERVICE_ROLE_KEY for database access
- Input validation is performed on all requests
- Usage logs are created with timestamps for audit trails

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request
- `405`: Method Not Allowed
- `500`: Server Error

Error responses include a JSON object with an `error` field:

```json
{
  "error": "Error description"
}
```
