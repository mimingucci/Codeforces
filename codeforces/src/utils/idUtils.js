/**
 * Safely compares two IDs that may be either strings or numbers
 * @param {string|number} id1 First ID
 * @param {string|number} id2 Second ID
 * @returns {boolean} True if IDs are equal
 */
export const isSameId = (id1, id2) => {
  if (id1 === undefined || id2 === undefined || id1 === null || id2 === null) {
    return false;
  }
  return String(id1) === String(id2);
};

/**
 * Converts any ID to string format for consistent handling
 * @param {string|number} id The ID to normalize
 * @returns {string} String representation of the ID
 */
export const normalizeId = (id) => {
  if (id === undefined || id === null) return null;
  return String(id);
};
