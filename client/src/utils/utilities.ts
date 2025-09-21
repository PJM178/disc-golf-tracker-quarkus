export function generateRandomId(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
};

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Check for navigation keys for keyboard events
export const NAVIGATION_KEYS = new Set([
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", 
  "PageUp", "PageDown", "Insert", "Delete", "Tab", "Escape", "Enter"
]);