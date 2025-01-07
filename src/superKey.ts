/**
 * Some sort of rolling authentication code? Not sure how safe this would be but
 * the idea is that only the person who has access to the main terminal knows
 * what the super key is (because it is refreshed in intervals & displayed on stdout)
 */


let superKey: string = "";
updateSuperKey();
console.log(getSuperKey());

/**
 * Generates a random password similar to Apple's Keychain style, using an easily typeable set of characters.
 * @param length - The length of the generated password.
 * @returns A randomly generated password string.
 */
export function updateSuperKey(length: number = 8) {
  // Excluding ambiguous characters (like O, 0, l, 1, etc.)
  const chars = 'abcdefghjkmnopqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  // Easily typable symbols
  const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';
  
  // Combine the sets. Adjust to taste.
  const allPossible = chars + symbols;

  let password = '';
  for (let i = 0; i < length; i++) {
    // Get a random index from the combined character set
    const randomIndex = Math.floor(Math.random() * allPossible.length);
    password += allPossible[randomIndex];
  }
  
  superKey = password;

  return;
}

export function getSuperKey(): string {
  return superKey;
}