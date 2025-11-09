# Vercel Deployment Guide

This guide will help you deploy the NestJS Prisma Redis Boilerplate to Vercel.

## Prerequisites

- Vercel account ([sign up here](https://vercel.com))
- GitHub repository with this code
- PostgreSQL database (Supabase/Neon/Railway recommended)
- Redis instance (Upstash recommended)

## Quick Deploy

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: `npm run vercel-build`
   - Output Directory: Leave empty (serverless)
   - Install Command: `npm install`

4. **Add Environment Variables**

   Click "Environment Variables" and add:

   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://user:password@host:port/db?connection_limit=1
   REDIS_HOST=your-redis-host.upstash.io
   REDIS_PORT=6379
   REDIS_PASSWORD=your-redis-password
   JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your-super-secure-refresh-secret-min-32-chars
   JWT_REFRESH_EXPIRES_IN=30d
   CORS_ORIGIN=https://yourdomain.com
   THROTTLE_TTL=60
   THROTTLE_LIMIT=10
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Your API will be live!

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add NODE_ENV
   vercel env add DATABASE_URL
   vercel env add REDIS_HOST
   vercel env add REDIS_PORT
   vercel env add REDIS_PASSWORD
   vercel env add JWT_SECRET
   vercel env add JWT_REFRESH_SECRET
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Database Setup

### Option 1: Supabase (Recommended)

1. **Create Project**
   - Go to [Supabase](https://supabase.com)
   - Create new project
   - Wait for provisioning

2. **Get Connection String**
   - Navigate to **Settings** > **Database**
   - Copy **Connection Pooling** string (Transaction mode)
   - Format: `postgresql://postgres.xxx:[password]@xxx.supabase.co:6543/postgres?pgbouncer=true`

3. **Use in Vercel**
   ```env
   DATABASE_URL="postgresql://postgres.xxx:[password]@xxx.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"
   ```

### Option 2: Neon

1. **Create Project**
   - Go to [Neon](https://neon.tech)
   - Create new project

2. **Get Connection String**
   - Copy connection string from dashboard
   - Use **Pooled connection**

3. **Use in Vercel**
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require&connection_limit=1"
   ```

### Option 3: Railway

1. **Create PostgreSQL**
   - Go to [Railway](https://railway.app)
   - Add PostgreSQL service

2. **Get Connection String**
   - Copy from service variables

3. **Use in Vercel**
   ```env
   DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:port/railway?connection_limit=1"
   ```

## Redis Setup

### Upstash Redis (Recommended for Vercel)

1. **Create Database**
   - Go to [Upstash](https://upstash.com)
   - Create new Redis database
   - Select region closest to your Vercel region

2. **Get Credentials**
   - Copy **Endpoint** and **Password**

3. **Use in Vercel**
   ```env
   REDIS_HOST=your-endpoint.upstash.io
   REDIS_PORT=6379
   REDIS_PASSWORD=your-password
   ```

### Redis Cloud

1. **Create Database**
   - Go to [Redis Cloud](https://redis.com/try-free/)
   - Create free database

2. **Get Credentials**
   - Copy endpoint and password

3. **Use in Vercel**
   ```env
   REDIS_HOST=redis-12345.c123.region.cloud.redislabs.com
   REDIS_PORT=12345
   REDIS_PASSWORD=your-password
   ```

## Environment Variables Reference

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `NODE_ENV` | Yes | `production` | Always set to production |
| `DATABASE_URL` | Yes | `postgresql://...?connection_limit=1` | **Must include** `connection_limit=1` |
| `REDIS_HOST` | Yes | `xxx.upstash.io` | Redis hostname |
| `REDIS_PORT` | Yes | `6379` | Redis port |
| `REDIS_PASSWORD` | No | `xxxxx` | Required for most providers |
| `JWT_SECRET` | Yes | `min-32-char-random-string` | Generate secure random string |
| `JWT_EXPIRES_IN` | No | `7d` | Access token expiry |
| `JWT_REFRESH_SECRET` | Yes | `min-32-char-random-string` | Different from JWT_SECRET |
| `JWT_REFRESH_EXPIRES_IN` | No | `30d` | Refresh token expiry |
| `CORS_ORIGIN` | No | `https://yourdomain.com` | Comma-separated for multiple |
| `THROTTLE_TTL` | No | `60` | Rate limit window (seconds) |
| `THROTTLE_LIMIT` | No | `10` | Max requests per window |

### Generate Secure Secrets

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Vercel Configuration

### vercel.json

The `vercel.json` file is already configured for serverless deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.ts"
    }
  ],
  "regions": ["sin1"],
  "functions": {
    "api/index.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

**Key settings:**
- **memory**: 1024 MB (adjust based on your needs)
- **maxDuration**: 10 seconds (Hobby plan limit)
- **regions**: Singapore (change to your preferred region)

### Available Regions

- `iad1` - Washington, D.C., USA
- `sfo1` - San Francisco, USA
- `gru1` - São Paulo, Brazil
- `fra1` - Frankfurt, Germany
- `sin1` - Singapore
- `hnd1` - Tokyo, Japan
- `syd1` - Sydney, Australia

## Post-Deployment

### 1. Test Your API

```bash
# Health check
curl https://your-app.vercel.app/api/v1/health

# API Documentation
open https://your-app.vercel.app/api/docs
```

### 2. Test Endpoints

```bash
# Register
curl -X POST https://your-app.vercel.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST https://your-app.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Monitor Logs

- Go to Vercel Dashboard > Your Project
- Click "Functions" tab
- View logs in real-time

### 4. Monitor Database

- Check connection pool usage
- Monitor slow queries
- Set up alerts

## Performance Optimization

### 1. Database Connection Pooling

**Critical:** Always use `connection_limit=1` in your `DATABASE_URL`:

```env
DATABASE_URL="postgresql://...?connection_limit=1&pgbouncer=true"
```

This prevents connection exhaustion in serverless environment.

### 2. Redis Connection

Use connection pooling for Redis:
- Upstash automatically handles this
- Redis Cloud works well with serverless

### 3. Cold Starts

- First request may be slow (1-3 seconds)
- Subsequent requests are fast (<100ms)
- Consider upgrading to Pro plan for better performance

### 4. Caching

Use Redis for:
- Session storage
- API response caching
- Rate limiting data

## Troubleshooting

### Build Fails

**Error:** "Cannot find module '@prisma/client'"

**Solution:**
```bash
# Ensure vercel-build script exists in package.json
"vercel-build": "prisma generate && prisma migrate deploy && nest build"
```

### Database Connection Error

**Error:** "Too many connections"

**Solution:**
- Add `connection_limit=1` to DATABASE_URL
- Use connection pooling (pgbouncer)
- Check Supabase/Neon connection limits

### Redis Connection Timeout

**Solution:**
- Verify Redis host and port
- Check Redis password
- Ensure Redis region is close to Vercel region

### Function Timeout

**Error:** "Function execution exceeded 10 seconds"

**Solution:**
- Optimize slow queries
- Add database indexes
- Upgrade to Pro plan (60 second timeout)

### Environment Variables Not Working

**Solution:**
- Redeploy after adding variables
- Check variable names (case-sensitive)
- Ensure no extra spaces

## Custom Domain

1. **Add Domain in Vercel**
   - Go to Project Settings > Domains
   - Add your domain
   - Follow DNS configuration steps

2. **Update CORS**
   ```env
   CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
   ```

3. **SSL Certificate**
   - Automatically provisioned by Vercel
   - No configuration needed

## Monitoring & Analytics

### Vercel Analytics (Free)

1. Enable in Project Settings
2. View metrics in dashboard
3. Monitor:
   - Request count
   - Response times
   - Error rates

### External Monitoring

Consider:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **DataDog** - APM monitoring
- **Better Stack** - Log management

## Cost Optimization

### Hobby Plan (Free)
- 100 GB-hours/month
- 100k invocations/month
- Good for: Development, small apps

### Pro Plan ($20/month)
- 1000 GB-hours/month
- 1M invocations/month
- 60 second timeout
- Better performance
- Good for: Production apps

### Tips to Reduce Costs

1. **Optimize function duration**
   - Reduce cold starts
   - Cache frequently accessed data
   - Optimize database queries

2. **Use edge caching**
   - Cache static responses
   - Use CDN for assets

3. **Monitor usage**
   - Track function invocations
   - Identify optimization opportunities

## Security Checklist

- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable CORS with specific origins
- [ ] Set up rate limiting
- [ ] Use HTTPS only
- [ ] Rotate secrets regularly
- [ ] Enable Vercel firewall (Pro plan)
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated

## Continuous Deployment

### Auto Deploy from GitHub

1. **Connect GitHub**
   - Vercel automatically connects

2. **Configure Branches**
   - Production: `main` branch
   - Preview: All other branches

3. **Deploy on Push**
   - Push to GitHub triggers deploy
   - View preview URLs for branches

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [NestJS Deployment Guide](https://docs.nestjs.com/faq/serverless)
- [Prisma Serverless Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

## Example Production URLs

After deployment, your API will be available at:

```
https://your-project.vercel.app/api/v1/health
https://your-project.vercel.app/api/docs
https://your-project.vercel.app/api/v1/auth/register
https://your-project.vercel.app/api/v1/auth/login
https://your-project.vercel.app/api/v1/todos
https://your-project.vercel.app/api/v1/users/me
```

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure environment variables
3. ✅ Test API endpoints
4. ✅ Add custom domain
5. ✅ Set up monitoring
6. ✅ Configure CI/CD
7. ✅ Implement backups
8. ✅ Scale as needed

---

**Happy Deploying! 🚀**

For issues or questions, please open an issue on GitHub.
