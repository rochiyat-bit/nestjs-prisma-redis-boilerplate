import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';

describe('App E2E Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.setGlobalPrefix('api/v1');

    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);
    await prismaService.cleanDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/api/v1/health (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('status', 'ok');
        });
    });
  });

  describe('Authentication', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('/api/v1/auth/register (POST) - should register new user', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data).toHaveProperty('refreshToken');
          expect(res.body.data.user.email).toBe(testUser.email);
          userId = res.body.data.user.id;
        });
    });

    it('/api/v1/auth/register (POST) - should fail with existing email', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(409);
    });

    it('/api/v1/auth/login (POST) - should login user', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data).toHaveProperty('refreshToken');
          authToken = res.body.data.accessToken;
        });
    });

    it('/api/v1/auth/login (POST) - should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .expect(401);
    });
  });

  describe('Todos', () => {
    let todoId: string;

    it('/api/v1/todos (POST) - should create todo', () => {
      return request(app.getHttpServer())
        .post('/api/v1/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Todo',
          description: 'Test Description',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.title).toBe('Test Todo');
          todoId = res.body.data.id;
        });
    });

    it('/api/v1/todos (GET) - should get all todos', () => {
      return request(app.getHttpServer())
        .get('/api/v1/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('meta');
          expect(Array.isArray(res.body.data.data)).toBe(true);
        });
    });

    it('/api/v1/todos/:id (GET) - should get todo by id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBe(todoId);
        });
    });

    it('/api/v1/todos/:id (PATCH) - should update todo', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ completed: true })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.completed).toBe(true);
        });
    });

    it('/api/v1/todos/:id (DELETE) - should delete todo', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });

    it('/api/v1/todos (GET) - should require authentication', () => {
      return request(app.getHttpServer()).get('/api/v1/todos').expect(401);
    });
  });

  describe('Users', () => {
    it('/api/v1/users/me (GET) - should get current user', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('email');
        });
    });

    it('/api/v1/users/me (PATCH) - should update user profile', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.name).toBe('Updated Name');
        });
    });
  });
});
