import { ApiProperty } from '@nestjs/swagger';
import { Todo } from '@prisma/client';

export class TodoEntity implements Todo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty()
  completed: boolean;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null;

  constructor(partial: Partial<TodoEntity>) {
    Object.assign(this, partial);
  }
}
