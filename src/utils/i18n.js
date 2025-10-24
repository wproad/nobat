/**
 * Translation utilities
 * These functions integrate with WordPress's translation system
 */

// Ensure wp.i18n exists (WordPress provides this)
const wpI18n = window.wp?.i18n || {
  __: (text) => text,
  _n: (single, plural, number) => (number === 1 ? single : plural),
  _x: (text, context) => text,
  sprintf: (...args) => args[0],
};

/**
 * Translate a string
 * @param {string} text - Text to translate
 * @param {string} domain - Text domain
 * @returns {string} Translated text
 */
export function __(text, domain = 'nobat') {
  return wpI18n.__(text, domain);
}

/**
 * Translate a string with plural forms
 * @param {string} single - Singular form
 * @param {string} plural - Plural form
 * @param {number} number - Number to determine which form to use
 * @param {string} domain - Text domain
 * @returns {string} Translated text
 */
export function _n(single, plural, number, domain = 'nobat') {
  return wpI18n._n(single, plural, number, domain);
}

/**
 * Translate a string with context
 * @param {string} text - Text to translate
 * @param {string} context - Context for the translation
 * @param {string} domain - Text domain
 * @returns {string} Translated text
 */
export function _x(text, context, domain = 'nobat') {
  return wpI18n._x(text, context, domain);
}

/**
 * sprintf-like string formatting
 * @param {string} format - Format string
 * @param {...any} args - Arguments to format
 * @returns {string} Formatted string
 */
export function sprintf(format, ...args) {
  return wpI18n.sprintf ? wpI18n.sprintf(format, ...args) : format;
}

