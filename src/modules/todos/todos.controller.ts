import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';
import { TodoEntity } from './entities/todo.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';

@ApiTags('Todos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({
    status: 201,
    description: 'Todo created successfully',
    type: TodoEntity,
  })
  async create(
    @CurrentUser('id') userId: string,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<TodoEntity> {
    return this.todosService.create(userId, createTodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos with pagination and filters' })
  @ApiPaginatedResponse(TodoEntity)
  async findAll(@CurrentUser('id') userId: string, @Query() query: QueryTodoDto) {
    return this.todosService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by ID' })
  @ApiParam({ name: 'id', description: 'Todo ID' })
  @ApiResponse({ status: 200, description: 'Todo found', type: TodoEntity })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ): Promise<TodoEntity> {
    return this.todosService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo' })
  @ApiParam({ name: 'id', description: 'Todo ID' })
  @ApiResponse({ status: 200, description: 'Todo updated', type: TodoEntity })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity> {
    return this.todosService.update(id, userId, updateTodoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a todo' })
  @ApiParam({ name: 'id', description: 'Todo ID' })
  @ApiResponse({ status: 204, description: 'Todo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string): Promise<void> {
    return this.todosService.remove(id, userId);
  }
}
