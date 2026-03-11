# Documentation Index

## Backend Documentation

All backend API documentation and guides are located in `docs/backend/`:

### Files

- **[BACKEND_README.md](./backend/BACKEND_README.md)** - Start here! Complete overview of backend system
- **[BACKEND_QUICK_START.md](./backend/BACKEND_QUICK_START.md)** - 5-minute quick start guide
- **[BACKEND.md](./backend/BACKEND.md)** - Complete API endpoint reference
- **[BACKEND_SETUP.md](./backend/BACKEND_SETUP.md)** - Advanced setup and configuration guide
- **[DEPLOY_FUNCTIONS.md](./backend/DEPLOY_FUNCTIONS.md)** - Step-by-step deployment instructions
- **[BACKEND_SUMMARY.txt](./backend/BACKEND_SUMMARY.txt)** - Overview of all created files

## Backend API Endpoints

The backend provides 4 REST API endpoints:

1. **GET /cards** - Retrieve communication cards
2. **GET /categories** - Retrieve categories
3. **POST /usage-log** - Log card usage
4. **GET /stats** - Get usage statistics

## Quick Navigation

### For First-Time Setup
1. Read: [BACKEND_README.md](./backend/BACKEND_README.md)
2. Read: [BACKEND_QUICK_START.md](./backend/BACKEND_QUICK_START.md)
3. Run: `./deploy.sh`

### For API Reference
- See: [BACKEND.md](./backend/BACKEND.md)

### For Detailed Setup
- See: [BACKEND_SETUP.md](./backend/BACKEND_SETUP.md)

### For Deployment Help
- See: [DEPLOY_FUNCTIONS.md](./backend/DEPLOY_FUNCTIONS.md)

## Backend Structure

```
supabase/functions/
├── _shared/cors.ts
├── cards/index.ts
├── categories/index.ts
├── usage-log/index.ts
└── stats/index.ts

lib/
└── api.ts (Frontend API service)
```

## Scripts

- `deploy.sh` - Deploy all functions
- `test-backend.sh` - Test all API endpoints

## Support

For questions, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
