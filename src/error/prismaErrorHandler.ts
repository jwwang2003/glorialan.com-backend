import { Prisma } from "@prisma/client";

interface Error {
  code?: string,
  msg: string,
  meta: Record<string, unknown> | undefined
}

export default function(error: any): Error {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch(error.code) {
      case "P2002": {
        // Unique constant violation
        return {
          code: error.code,
          msg: "Unique field value already exists!",
          meta: error.meta
        }
      }
      default:
        break;
    }
  }

  return {
    msg: "Unknown error.",
    meta: undefined
  }
}