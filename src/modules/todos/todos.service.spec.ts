import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TodosService } from './todos.service';
import { PrismaService } from '../../database/prisma.service';

describe('TodosService', () => {
  let service: TodosService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    todo: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodosService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<TodosService>(TodosService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const userId = 'user-1';
      const createTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
      };

      const createdTodo = {
        id: 'todo-1',
        ...createTodoDto,
        completed: false,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockPrismaService.todo.create.mockResolvedValue(createdTodo);

      const result = await service.create(userId, createTodoDto);

      expect(result).toEqual(createdTodo);
      expect(mockPrismaService.todo.create).toHaveBeenCalledWith({
        data: { ...createTodoDto, userId },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated todos', async () => {
      const userId = 'user-1';
      const query = { page: 1, limit: 10 };

      const todos = [
        {
          id: 'todo-1',
          title: 'Todo 1',
          description: null,
          completed: false,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      mockPrismaService.todo.findMany.mockResolvedValue(todos);
      mockPrismaService.todo.count.mockResolvedValue(1);

      const result = await service.findAll(userId, query);

      expect(result.data).toEqual(todos);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', async () => {
      const userId = 'user-1';
      const todoId = 'todo-1';

      const todo = {
        id: todoId,
        title: 'Test Todo',
        description: null,
        completed: false,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockPrismaService.todo.findFirst.mockResolvedValue(todo);

      const result = await service.findOne(todoId, userId);

      expect(result).toEqual(todo);
    });

    it('should throw NotFoundException if todo not found', async () => {
      mockPrismaService.todo.findFirst.mockResolvedValue(null);

      await expect(service.findOne('invalid-id', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const userId = 'user-1';
      const todoId = 'todo-1';
      const updateTodoDto = { title: 'Updated Title' };

      const existingTodo = {
        id: todoId,
        title: 'Original Title',
        description: null,
        completed: false,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const updatedTodo = { ...existingTodo, ...updateTodoDto };

      mockPrismaService.todo.findFirst.mockResolvedValue(existingTodo);
      mockPrismaService.todo.update.mockResolvedValue(updatedTodo);

      const result = await service.update(todoId, userId, updateTodoDto);

      expect(result.title).toBe(updateTodoDto.title);
    });
  });

  describe('remove', () => {
    it('should soft delete a todo', async () => {
      const userId = 'user-1';
      const todoId = 'todo-1';

      const todo = {
        id: todoId,
        title: 'Test Todo',
        userId,
        deletedAt: null,
      };

      mockPrismaService.todo.findFirst.mockResolvedValue(todo);
      mockPrismaService.todo.update.mockResolvedValue({ ...todo, deletedAt: new Date() });

      await service.remove(todoId, userId);

      expect(mockPrismaService.todo.update).toHaveBeenCalledWith({
        where: { id: todoId },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });
});
