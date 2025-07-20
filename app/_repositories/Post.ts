// _repositories/Post.ts
import { prisma } from "@/utils/prismaSingleton";
import { Post as PrismaPost } from "@prisma/client";

export type Post = PrismaPost & {
  user?: {
    name: string | null;
  };
};

export type CreatePostParams = {
  title: string;
  content: string;
  userId: number;
};

export namespace PostRepository {
  export async function findMany(): Promise<Post[]> {
    return await prisma.post.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  export async function create(params: CreatePostParams) {
    const { title, content, userId } = params;
    return await prisma.post.create({
      data: { title, content, userId },
    });
  }
}
