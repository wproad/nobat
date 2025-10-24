/**
 * Simple DOM ready utility
 * @param {Function} callback - Function to run when DOM is ready
 */
export default function domReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

