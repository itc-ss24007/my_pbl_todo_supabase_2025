import { prisma } from "@/utils/prismaSingleton";
import { Memo as PrismaMemo, Prisma } from "@prisma/client";

export type Memo = PrismaMemo;

export type CreateMemoParams = {
  title: string;
  items?: string;
  textContent?: string;
  images?: string;
  urls?: string;
  type: string;
  userId: number;
};

export namespace MemoRepository {
  // 指定ユーザーのメモだけ取得する（安全のため必ずユーザーIDで絞る）
  export async function findManyByUserId(userId: number): Promise<Memo[]> {
    return await prisma.memo.findMany({
      where: { userId },
      orderBy: { id: 'desc' },
    });
  }

  // 指定IDのメモを取得（ただし、呼び出し元でユーザーIDチェックが必要）
  export async function findById(id: number): Promise<Memo | null> {
    return await prisma.memo.findUnique({
      where: { id },
    });
  }

  // 新規作成（userIdで必ずユーザーを指定）
  export async function create(params: CreateMemoParams): Promise<Memo> {
    const { title, items, textContent, images, urls, type, userId } = params;
    return await prisma.memo.create({
      data: {
        title,
        items,
        textContent,
        images,
        urls,
        type,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  // 更新（呼び出し元で対象メモの所有権を確認すべき）
  export async function update(
    id: number,
    data: Partial<Omit<CreateMemoParams, 'userId'>>
  ): Promise<Memo> {
    return await prisma.memo.update({
      where: { id },
      data,
    });
  }

  // 削除（呼び出し元で所有権を確認すべき）
  export async function deleteById(id: number): Promise<Memo> {
    return await prisma.memo.delete({
      where: { id },
    });
  }
}
