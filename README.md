# NestJS Prisma Redis Boilerplate

A production-ready NestJS boilerplate with Prisma, Redis, PostgreSQL, and comprehensive features for building scalable REST APIs.

## Features

- **NestJS 10.x** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **Prisma ORM** - Next-generation ORM for PostgreSQL
- **Redis** - Caching and session management
- **JWT Authentication** - Access & refresh token implementation
- **Swagger/OpenAPI** - Comprehensive API documentation
- **Validation** - Request validation with class-validator
- **Error Handling** - Global exception filters
- **Testing** - Unit and E2E tests with Jest
- **Docker** - Containerized development and deployment
- **Security** - Helmet, CORS, rate limiting
- **Logging** - Request/response logging
- **Vercel Ready** - Serverless deployment configuration

## Tech Stack

- **Framework**: NestJS 10.x with Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Cache**: Redis
- **Validation**: class-validator & class-transformer
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI
- **Container**: Docker & Docker Compose

## Project Structure

```
src/
├── modules/
│   ├── auth/              # Authentication (JWT, register, login)
│   ├── users/             # User management
│   ├── todos/             # Todo CRUD with pagination
│   └── health/            # Health check endpoint
├── common/
│   ├── decorators/        # Custom decorators (@CurrentUser, @Public)
│   ├── filters/           # Exception filters
│   ├── guards/            # Auth guards
│   ├── interceptors/      # Response & logging interceptors
│   ├── pipes/             # Validation pipes
│   ├── dto/               # Shared DTOs
│   └── interfaces/        # Shared interfaces
├── config/                # Configuration modules
├── database/              # Prisma service
└── main.ts                # Application entry point

prisma/
├── schema.prisma          # Database schema
├── migrations/            # Database migrations
└── seed.ts                # Database seeding

test/
└── app.e2e-spec.ts        # E2E tests
```

## Prerequisites

- Node.js 20.x or higher
- PostgreSQL 14.x or higher
- Redis 7.x or higher
- Docker & Docker Compose (optional)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd nestjs-prisma-redis-boilerplate
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment setup

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# App
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nestjs_db?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_REFRESH_EXPIRES_IN=30d
```

### 4. Database setup

Start PostgreSQL and Redis (using Docker):

```bash
npm run docker:up
```

Or use Docker Compose directly:

```bash
docker-compose up -d postgres redis
```

Run migrations:

```bash
npm run prisma:migrate
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

Seed the database (optional):

```bash
npm run prisma:seed
```

### 5. Start development server

```bash
npm run start:dev
```

The API will be available at:
- API: http://localhost:3000
- Swagger docs: http://localhost:3000/api/docs
- Health check: http://localhost:3000/api/v1/health

## Available Scripts

```bash
# Development
npm run start:dev          # Start with watch mode
npm run start:debug        # Start with debug mode

# Production
npm run build              # Build for production
npm run start:prod         # Start production server

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run e2e tests

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open Prisma Studio
npm run prisma:seed        # Seed database

# Docker
npm run docker:up          # Start all services
npm run docker:down        # Stop all services
npm run docker:logs        # View logs

# Code Quality
npm run lint               # Lint code
npm run format             # Format code with Prettier
```

## API Endpoints

### Authentication

```
POST   /api/v1/auth/register     # Register new user
POST   /api/v1/auth/login        # Login user
POST   /api/v1/auth/refresh      # Refresh access token
```

### Users

```
GET    /api/v1/users/me          # Get current user profile
PATCH  /api/v1/users/me          # Update profile
DELETE /api/v1/users/me          # Delete account
```

### Todos

```
POST   /api/v1/todos             # Create todo
GET    /api/v1/todos             # Get all todos (with pagination)
GET    /api/v1/todos/:id         # Get todo by ID
PATCH  /api/v1/todos/:id         # Update todo
DELETE /api/v1/todos/:id         # Delete todo (soft delete)
```

### Health

```
GET    /api/v1/health            # Health check
```

## API Documentation

Once the application is running, visit http://localhost:3000/api/docs to access the interactive Swagger documentation.

Features:
- Try out API endpoints directly
- View request/response schemas
- Bearer token authentication
- Example requests and responses

## Authentication

This boilerplate uses JWT (JSON Web Tokens) for authentication:

1. **Register** or **Login** to receive access and refresh tokens
2. Use the access token in the `Authorization` header: `Bearer <token>`
3. Access tokens expire after 7 days (configurable)
4. Use refresh token to get new access tokens without re-authentication

### Example

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'

# Response
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}

# Use token in requests
curl -X GET http://localhost:3000/api/v1/todos \
  -H "Authorization: Bearer <accessToken>"
```

## Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  todos     Todo[]
}
```

### Todo Model

```prisma
model Todo {
  id          String    @id @default(uuid())
  title       String
  description String?
  completed   Boolean   @default(false)
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime? # Soft delete
}
```

## Testing

### Unit Tests

Run unit tests for services:

```bash
npm run test
```

### E2E Tests

Run end-to-end tests:

```bash
npm run test:e2e
```

### Coverage

Generate test coverage report:

```bash
npm run test:cov
```

Coverage report will be available in the `coverage/` directory.

## Docker Deployment

### Using Docker Compose

1. **Start all services** (PostgreSQL, Redis, NestJS app):

```bash
docker-compose up -d
```

2. **View logs**:

```bash
docker-compose logs -f
```

3. **Stop services**:

```bash
docker-compose down
```

### Services

- **PostgreSQL**: Port 5432
- **Redis**: Port 6379
- **NestJS App**: Port 3000
- **pgAdmin**: Port 5050 (optional)

Access pgAdmin at http://localhost:5050:
- Email: admin@admin.com
- Password: admin

## Production Deployment

### Deploy to Vercel (Recommended)

This boilerplate is **fully configured** for Vercel serverless deployment.

**Quick Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/nestjs-prisma-redis-boilerplate)

**Manual Deploy:**

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Import your repository
   - Configure environment variables (see below)

3. **Required Environment Variables**
   ```env
   DATABASE_URL=postgresql://...?connection_limit=1
   REDIS_HOST=your-redis.upstash.io
   REDIS_PORT=6379
   REDIS_PASSWORD=xxx
   JWT_SECRET=your-32-char-secret
   JWT_REFRESH_SECRET=your-32-char-secret
   NODE_ENV=production
   ```

4. **Deploy** - Click deploy and wait 2-3 minutes

**📖 Complete Vercel Guide:** See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for:
- Step-by-step deployment guide
- Database setup (Supabase/Neon/Railway)
- Redis setup (Upstash recommended)
- Environment variables reference
- Troubleshooting tips
- Performance optimization

### Other Platforms

For deployment to other platforms, see [DEPLOYMENT.md](./DEPLOYMENT.md):
- **AWS** (EC2, ECS, Lambda)
- **Google Cloud** (Cloud Run, GKE)
- **DigitalOcean** (App Platform, Droplets)
- **Heroku**
- **Railway**

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Server port | `3000` | No |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `REDIS_HOST` | Redis host | `localhost` | Yes |
| `REDIS_PORT` | Redis port | `6379` | Yes |
| `REDIS_PASSWORD` | Redis password | - | No |
| `JWT_SECRET` | JWT secret key | - | Yes |
| `JWT_EXPIRES_IN` | Access token expiry | `7d` | No |
| `JWT_REFRESH_SECRET` | Refresh token secret | - | Yes |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `30d` | No |
| `CORS_ORIGIN` | Allowed CORS origins | `*` | No |
| `THROTTLE_TTL` | Rate limit window (seconds) | `60` | No |
| `THROTTLE_LIMIT` | Max requests per window | `10` | No |

## Security Features

- **Helmet** - Security headers
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** - Throttle requests to prevent abuse
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password encryption
- **Validation** - Input validation and sanitization
- **Error Handling** - Safe error messages (no sensitive data leakage)

## Best Practices

This boilerplate follows NestJS best practices:

- **Modular architecture** - Feature-based modules
- **Dependency injection** - Loose coupling
- **DTOs** - Data validation and transformation
- **Error handling** - Centralized exception handling
- **Logging** - Request/response logging
- **Testing** - Unit and E2E tests
- **Type safety** - Full TypeScript coverage
- **Documentation** - Swagger/OpenAPI specs
- **Security** - Industry-standard security practices

## Troubleshooting

### Database connection fails

- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Verify database exists

### Redis connection fails

- Ensure Redis is running
- Check `REDIS_HOST` and `REDIS_PORT`
- Verify Redis password if set

### Prisma Client not found

```bash
npm run prisma:generate
```

### Migration fails

```bash
npm run prisma:migrate
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review Swagger API docs

## Roadmap

- [ ] GraphQL support
- [ ] WebSocket implementation
- [ ] Microservices architecture
- [ ] Event sourcing
- [ ] CQRS pattern
- [ ] Advanced caching strategies
- [ ] Monitoring and observability
- [ ] CI/CD pipelines

## Acknowledgments

- [NestJS](https://nestjs.com/) - The progressive Node.js framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Redis](https://redis.io/) - In-memory data structure store

---

**Built with ❤️ using NestJS**
