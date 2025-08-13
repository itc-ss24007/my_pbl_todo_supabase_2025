import { prisma } from '@/utils/prismaSingleton';
import { Todo as PrismaTodo } from '@prisma/client';

export type Todo = PrismaTodo;

export type CreateTodoParams = {
  userId: number;
  title: string;
  description?: string;
  date: Date;
  time?: Date | null;
  datetime?: Date | null;
  isDone?: boolean;
  isRemind?: boolean;
  remindTime?: Date | null;
};

export namespace todoRepository {
  export async function findManyByUserId(userId: number): Promise<Todo[]> {
    return await prisma.todo.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
  }

  export async function findById(id: number): Promise<Todo | null> {
    return await prisma.todo.findUnique({
      where: { id },
    });
  }

  export async function create(params: CreateTodoParams): Promise<Todo> {
    const {
      userId,
      title,
      description,
      date,
      time = null,
      datetime = null,
      isDone = false,
      isRemind = false,
      remindTime = null,
    } = params;

    return await prisma.todo.create({
      data: {
        user: { connect: { id: userId } },
        title,
        description,
        date,
        time,
        datetime,
        isDone,
        isRemind,
        remindTime,
      },
    });
  }

  export async function update(
    id: number,
    data: Partial<Omit<CreateTodoParams, 'userId'>>
  ): Promise<Todo> {
    return await prisma.todo.update({
      where: { id },
      data,
    });
  }

  export async function deleteById(id: number): Promise<Todo> {
    return await prisma.todo.delete({
      where: { id },
    });
  }
}
