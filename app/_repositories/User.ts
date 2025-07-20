// app/_repositories/User.ts
import { prisma } from "@/utils/prismaSingleton";
import { User as PrismaUser } from "@prisma/client";

export type User = PrismaUser;
export type CreateUserParams = {
  name?: string;
  email: string;
  supabaseId: string;
};

export namespace UserRepository {
  export async function findMany(): Promise<User[]> {
    return await prisma.user.findMany({
      orderBy: {
        id: "desc",
      },
    });
  }

  export async function findUnique(userId: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  // export async function create(params: {
  //   name?: string;
  //   email: string;
  //   supabaseId: string;
  // }): Promise<User> {
  //   const { name, email, supabaseId } = params;
  //   return await prisma.user.create({
  //     data: { name, email, supabaseId },
  //   });
  // }

  // export async function createUser(params: CreateUserParams): Promise<User> {
  //   const { name, email, supabaseId } = params;

  //   const existing = await prisma.user.findUnique({
  //     where: { email },
  //   });

  //   if (!existing) {
  //     return await prisma.user.create({
  //       data: { name, email, supabaseId },
  //     });
  //   } else {
  //     return existing; // または throw new Error("ユーザーは既に存在します");
  //   }
  // }

  export async function createUser(params: CreateUserParams): Promise<User> {
    const { name, email, supabaseId } = params;
    // これなら新規作成時に一時的なエラーがでない

    return await prisma.user.upsert({
      where: { email },
      update: {}, // 上書き不要なら空オブジェクト
      create: { name, email, supabaseId },
    });
  }

  export async function update(
    id: number,
    data: { name: string; email: string }
  ): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  export async function deleteById(id: number): Promise<User> {
    return await prisma.user.delete({
      where: { id },
    });
  }

  export async function findBySupabaseId(
    supabaseId: string
  ): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { supabaseId },
    });
  }
}
