import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';
import { TodoEntity } from './entities/todo.entity';
import { PaginatedResponse } from '../../common/interfaces/response.interface';

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const todo = await this.prisma.todo.create({
      data: {
        ...createTodoDto,
        userId,
      },
    });

    return new TodoEntity(todo);
  }

  async findAll(userId: string, query: QueryTodoDto): Promise<PaginatedResponse<TodoEntity>> {
    const { page = 1, limit = 10, completed, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
      deletedAt: null,
    };

    if (completed !== undefined) {
      where.completed = completed;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [todos, total] = await Promise.all([
      this.prisma.todo.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.todo.count({ where }),
    ]);

    return {
      data: todos.map((todo) => new TodoEntity(todo)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string): Promise<TodoEntity> {
    const todo = await this.prisma.todo.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return new TodoEntity(todo);
  }

  async update(id: string, userId: string, updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    await this.findOne(id, userId);

    const todo = await this.prisma.todo.update({
      where: { id },
      data: updateTodoDto,
    });

    return new TodoEntity(todo);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);

    // Soft delete
    await this.prisma.todo.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async hardDelete(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);

    await this.prisma.todo.delete({
      where: { id },
    });
  }
}
