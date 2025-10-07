// Define the order of pages that appear in the menu
const PAGE_ORDER = [
  '/home',
  '/images',
  '/video',
  '/messages',
  '/settings'
];

/**
 * Get the previous page path
 * @param {string} currentPath - Current page path
 * @returns {string|null} Previous page path or null if at first page
 */
export const getPreviousPage = (currentPath) => {
  // Extract userId from current path (e.g., /user123/home -> user123)
  const pathParts = currentPath.split('/');
  const userId = pathParts[1]; // Should be the userId part
  
  if (!userId || userId === 'admin') {
    return null; // No navigation for admin or invalid paths
  }
  
  // Extract the page part (e.g., /user123/home -> /home)
  const pagePath = '/' + pathParts.slice(2).join('/');
  const currentIndex = PAGE_ORDER.indexOf(pagePath);
  
  if (currentIndex > 0) {
    return `/${userId}${PAGE_ORDER[currentIndex - 1]}`;
  }
  return null;
};

/**
 * Get the next page path
 * @param {string} currentPath - Current page path
 * @returns {string|null} Next page path or null if at last page
 */
export const getNextPage = (currentPath) => {
  // Extract userId from current path (e.g., /user123/home -> user123)
  const pathParts = currentPath.split('/');
  const userId = pathParts[1]; // Should be the userId part
  
  if (!userId || userId === 'admin') {
    return null; // No navigation for admin or invalid paths
  }
  
  // Extract the page part (e.g., /user123/home -> /home)
  const pagePath = '/' + pathParts.slice(2).join('/');
  const currentIndex = PAGE_ORDER.indexOf(pagePath);
  
  if (currentIndex >= 0 && currentIndex < PAGE_ORDER.length - 1) {
    return `/${userId}${PAGE_ORDER[currentIndex + 1]}`;
  }
  return null;
};

