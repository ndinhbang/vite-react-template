import { pages } from '@/_pages.js';
import { generatePath } from 'react-router-dom';

export function getPageSetting(name) {
  return pages[name];
}

/**
 *
 * @param name
 * @param params
 * @returns {string}
 */
export function route(name, params = {}) {
  // @link https://reactrouter.com/en/main/utils/generate-path
  return generatePath(getPageSetting(name)?.path || '/', params);
}
