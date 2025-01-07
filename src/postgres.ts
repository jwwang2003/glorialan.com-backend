import { PrismaClient } from '@prisma/client';
import { v4 as UUID } from "uuid";
import { generateHash } from "@/utils/hash";
import prismaErrorHandler from '@/error/prismaErrorHandler';

const prisma = new PrismaClient();

export async function createUser(
  name: string,
  username: string,
  password: string,
  description: string = "",
  role: number[] = [],
  special_privledges: string[] = [],
): Promise<[boolean, Object | undefined]> {

  try {
    const user = await prisma.user.create({
      data: {
        name: name,
        uuid: UUID(),
        username: username,
        password: await generateHash(password),
        description: description,
        role: role,
        special_privledges: special_privledges,
      }
    });

    if (!user) return [false, "Something very went wrong."];
    console.log(user);
    return [true, user];
  } catch (e) {
    const error = prismaErrorHandler(e);
    const {msg, meta} = error;
    console.log(msg, meta);
    return [false, error];
  }
}

export async function findUser(
  username: string
) {
  const user = await prisma.user.findUnique({
    where: {
      username: username
    }
  });
  return user;
}