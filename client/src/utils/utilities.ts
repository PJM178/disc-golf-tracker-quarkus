export function generateRandomId(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
};

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}