# Deploy Edge Functions to Supabase

## Prerequisites

1. Install Supabase CLI:
   ```bash
   # Using Homebrew (macOS)
   brew install supabase/tap/supabase

   # Using npm
   npm install -g supabase

   # Using Docker
   docker run -it --rm supabase/cli:latest help
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your_project_id
   ```

   Find your project ID in Supabase Dashboard → Settings → General

## Deploy All Functions

Run this command from the project root directory:

```bash
supabase functions deploy cards
supabase functions deploy categories
supabase functions deploy usage-log
supabase functions deploy stats
```

Or deploy all at once:

```bash
supabase functions deploy
```

## Verify Deployment

Check that functions are deployed:

```bash
supabase functions list
```

You should see:
```
cards
categories
usage-log
stats
```

## Test Functions

After deployment, test using the provided script:

```bash
./test-backend.sh
```

Or manually test each endpoint:

```bash
# Test GET /cards
curl https://your-project.supabase.co/functions/v1/cards \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"

# Test GET /categories
curl https://your-project.supabase.co/functions/v1/categories \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"

# Test POST /usage-log
curl -X POST https://your-project.supabase.co/functions/v1/usage-log \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"card_id": "test-card-id"}'

# Test GET /stats
curl https://your-project.supabase.co/functions/v1/stats \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

## Troubleshooting

### "supabase: command not found"
Install Supabase CLI from: https://supabase.com/docs/guides/cli

### "Not authenticated"
Run: `supabase login` and follow the prompts

### "Project not linked"
Run: `supabase link --project-ref your_project_id`

### "Function deployment failed"
- Check syntax errors in the function files
- Ensure CORS headers are properly configured
- Review logs: `supabase functions list --json`

## Function Details

All functions are located in `supabase/functions/`:

- **cards/** - GET endpoint for retrieving cards
- **categories/** - GET endpoint for retrieving categories
- **usage-log/** - POST endpoint for logging card usage
- **stats/** - GET endpoint for usage statistics
- **_shared/cors.ts** - Shared CORS configuration

## What Gets Deployed

When you run `supabase functions deploy`, it uploads:

1. Each function's `index.ts` file
2. Shared dependencies (`_shared/cors.ts`)
3. Node modules that are imported

The functions run in a Deno runtime on Supabase infrastructure.

## Environment Variables

Functions automatically have access to:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Admin API key

**These are automatically provided by Supabase** - no additional setup needed!

## After Deployment

Once deployed, the functions are available at:

```
https://your-project.supabase.co/functions/v1/cards
https://your-project.supabase.co/functions/v1/categories
https://your-project.supabase.co/functions/v1/usage-log
https://your-project.supabase.co/functions/v1/stats
```

Update your frontend `.env` file if needed:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

The `lib/api.ts` service will automatically use these endpoints.

## Next Steps

1. Install Supabase CLI
2. Run `supabase login`
3. Run `supabase link --project-ref your_project_id`
4. Run `supabase functions deploy`
5. Run `./test-backend.sh` to verify
6. Start using the APIs in your app!

## Support

- Supabase Documentation: https://supabase.com/docs
- CLI Reference: https://supabase.com/docs/reference/cli
- Edge Functions Guide: https://supabase.com/docs/guides/functions
