import type { User } from "@prisma/client";

interface StrippedUser {
  uuid: string,
  name: string,
  username: string,
  role?: number[],
  special_privledges?: string[],
};

export function stripUser(user: User): StrippedUser {
  // Mainly for stripping the password hash

  return {
    uuid: user.uuid,
    name: user.name,
    username: user.username,
    role: user.role,
    special_privledges: user.special_privledges,
  }
}