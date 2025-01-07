import bcrypt from "bcryptjs";

const SALT_ROUNDES: number | string = process.env.SALT_ROUNDS || 10;

/**
 * Utility function that hashes a string
 * @param input 
 * @returns The hashed string
 */
export async function generateHash(input: string): Promise<string> {
  const hash = await bcrypt.hash(input, SALT_ROUNDES);
  return hash;
}

/**
 * Utility function compares two hashes (two passwords) and checks for equality
 * @param string String input `s`
 * @param hash Hash input `hash`
 * @returns True if the two hashes are equal, false otherwise
 */
export async function compareHash(string: string, hash: string): Promise<boolean> {
  const result: boolean = await bcrypt.compare(string, hash);
  return result;
}