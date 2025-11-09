# Deployment Guide

This guide covers deploying the NestJS Prisma Redis Boilerplate to various platforms.

## Table of Contents
- [Vercel Deployment](#vercel-deployment)
- [Database Setup (Production)](#database-setup-production)
- [Redis Setup (Production)](#redis-setup-production)
- [Environment Variables](#environment-variables)

## Vercel Deployment

### Prerequisites
- Vercel account
- PostgreSQL database (Supabase, Neon, Railway, etc.)
- Redis instance (Upstash, Redis Cloud, etc.)

### Steps

1. **Install Vercel CLI** (optional, for CLI deployment)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **Deploy via CLI**
   ```bash
   vercel
   ```

4. **Configure Environment Variables**
   Add the following environment variables in Vercel Dashboard (Settings > Environment Variables):
   ```
   NODE_ENV=production
   DATABASE_URL=your_production_database_url
   REDIS_HOST=your_redis_host
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your_refresh_secret
   JWT_REFRESH_EXPIRES_IN=30d
   CORS_ORIGIN=https://yourdomain.com
   ```

5. **Run Database Migrations**
   After deployment, run migrations using Vercel CLI:
   ```bash
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

## Database Setup (Production)

### Option 1: Supabase (Recommended)

1. **Create Project**
   - Go to [Supabase](https://supabase.com)
   - Create a new project
   - Wait for database to be provisioned

2. **Get Connection String**
   - Navigate to Settings > Database
   - Copy the connection string (Connection Pooling recommended)
   - Format: `postgresql://postgres:[password]@[host]:5432/postgres?pgbouncer=true`

3. **Update Environment Variables**
   ```bash
   DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres?pgbouncer=true&connection_limit=1"
   ```

### Option 2: Neon

1. **Create Project**
   - Go to [Neon](https://neon.tech)
   - Create a new project
   - Select region closest to your users

2. **Get Connection String**
   - Copy the connection string from dashboard
   - Use pooled connection for serverless

3. **Update Environment Variables**
   ```bash
   DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
   ```

### Option 3: Railway

1. **Create PostgreSQL Service**
   - Go to [Railway](https://railway.app)
   - Create new project
   - Add PostgreSQL service

2. **Get Connection String**
   - Click on PostgreSQL service
   - Copy the connection string

3. **Update Environment Variables**
   ```bash
   DATABASE_URL="postgresql://postgres:[password]@[host]:5432/railway"
   ```

## Redis Setup (Production)

### Option 1: Upstash (Recommended for Vercel)

1. **Create Database**
   - Go to [Upstash](https://upstash.com)
   - Create a Redis database
   - Select region closest to your deployment

2. **Get Connection Details**
   - Copy endpoint and password from dashboard

3. **Update Environment Variables**
   ```bash
   REDIS_HOST=your-redis-endpoint.upstash.io
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   ```

### Option 2: Redis Cloud

1. **Create Database**
   - Go to [Redis Cloud](https://redis.com/try-free/)
   - Create a new subscription
   - Create a database

2. **Get Connection Details**
   - Copy endpoint and password

3. **Update Environment Variables**
   ```bash
   REDIS_HOST=your-endpoint.redis.cloud
   REDIS_PORT=12345
   REDIS_PASSWORD=your_password
   ```

## Environment Variables

### Required Variables

```bash
# Application
NODE_ENV=production
PORT=3000

# Database (use connection pooling for serverless)
DATABASE_URL="postgresql://user:password@host:port/database?connection_limit=1"

# Redis
REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# JWT (use strong secrets in production)
JWT_SECRET=your_super_secure_jwt_secret_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_min_32_chars
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

### Generating Secure Secrets

```bash
# Generate secure random strings for JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Post-Deployment

1. **Run Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```

2. **Seed Database (optional)**
   ```bash
   npm run prisma:seed
   ```

3. **Test API**
   - Health check: `https://your-domain.vercel.app/api/v1/health`
   - API docs: `https://your-domain.vercel.app/api/docs`

4. **Monitor Application**
   - Check Vercel logs for errors
   - Monitor database connections
   - Monitor Redis usage

## Troubleshooting

### Database Connection Issues

- Use connection pooling (pgbouncer)
- Set `connection_limit=1` in DATABASE_URL
- Use `?pgbouncer=true` for Supabase

### Redis Connection Issues

- Verify Redis host and port
- Check firewall rules
- Ensure password is correct

### Build Failures

- Check Node.js version (should be 20.x)
- Verify all dependencies are in package.json
- Check for TypeScript errors

### Prisma Issues

- Run `npx prisma generate` after changes
- Use `prisma migrate deploy` for production
- Never use `prisma migrate dev` in production

## Performance Tips

1. **Database**
   - Use connection pooling
   - Add indexes for frequently queried fields
   - Monitor slow queries

2. **Redis**
   - Set appropriate TTL values
   - Monitor memory usage
   - Use Redis for session storage if needed

3. **Application**
   - Enable compression
   - Use CDN for static assets
   - Monitor response times

## Security Checklist

- [ ] Use strong JWT secrets (min 32 characters)
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable helmet security headers
- [ ] Keep dependencies updated
- [ ] Monitor for security vulnerabilities

## Scaling

For high-traffic applications:

1. **Database**
   - Use read replicas
   - Implement caching strategy
   - Optimize queries

2. **Application**
   - Use multiple instances
   - Implement horizontal scaling
   - Use load balancer

3. **Redis**
   - Use Redis cluster
   - Implement cache eviction policies
   - Monitor cache hit rates
