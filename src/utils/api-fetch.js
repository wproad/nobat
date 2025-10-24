/**
 * WordPress API fetch wrapper using native fetch
 * Replacement for @wordpress/api-fetch
 */

/**
 * Fetch data from WordPress REST API
 * @param {Object} options - Fetch options
 * @param {string} options.path - API path (e.g., '/nobat/v2/appointments')
 * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} options.data - Data to send with request
 * @returns {Promise} Response data
 */
export default async function apiFetch({ path, method = 'GET', data = null }) {
  // Get REST API settings from localized script
  const apiSettings = window.wpApiSettings || {};
  
  // Normalize the root URL and path to avoid double slashes
  let root = apiSettings.root || '/wp-json';
  root = root.endsWith('/') ? root.slice(0, -1) : root; // Remove trailing slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`; // Ensure leading slash
  const url = `${root}${normalizedPath}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': apiSettings.nonce || '',
    },
    credentials: 'same-origin',
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP Error ${response.status}`);
      error.code = errorData.code || response.status;
      error.data = errorData.data || null;
      throw error;
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    // Re-throw with better error message
    if (error.message === 'Failed to fetch') {
      error.message = 'Network error. Please check your connection.';
    }
    throw error;
  }
}

