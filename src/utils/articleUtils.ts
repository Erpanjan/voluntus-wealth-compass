
/**
 * Creates a unique slug from a title
 * @param title The title to convert to a slug
 * @returns A unique slug
 */
export const createUniqueSlug = (title: string): string => {
  // Convert to lowercase, replace spaces with hyphens, and remove non-alphanumeric characters
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
  
  // Add a timestamp to ensure uniqueness
  return `${baseSlug}-${Date.now()}`;
};
