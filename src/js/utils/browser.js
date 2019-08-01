/**
 * @file browser.js
 * @module browser
 */
import * as Dom from './dom';
import window from 'global/window';
import defineLazyProperty from './define-lazy-property.js';

const USER_AGENT = window.navigator && window.navigator.userAgent || '';

export const browser = {};

/**
 * Whether or not this device is an iPad.
 *
 * @static
 * @const
 * @type {Boolean}
 */
defineLazyProperty(browser, 'IS_IPAD', () => (/iPad/i).test(USER_AGENT));

/**
 * Whether or not this device is an iPhone.
 *
 * @static
 * @const
 * @type {Boolean}
 */
// The Facebook app's UIWebView identifies as both an iPhone and iPad, so
// to identify iPhones, we need to exclude iPads.
// http://artsy.github.io/blog/2012/10/18/the-perils-of-ios-user-agent-sniffing/
defineLazyProperty(browser, 'IS_IPHONE', () => (/iPhone/i).test(USER_AGENT) && !browser.IS_IPAD);
/**
 * Whether or not this device is an iPod.
 *
 * @static
 * @const
 * @type {Boolean}
 */
defineLazyProperty(browser, 'IS_IPOD', () => (/iPod/i).test(USER_AGENT));

/**
 * Whether or not this is an iOS device.
 *
 * @static
 * @const
 * @type {Boolean}
 */
defineLazyProperty(browser, 'IS_IOS', () => browser.IS_IPHONE || browser.IS_IPAD || browser.IS_IPOD);

/**
 * The detected iOS version - or `null`.
 *
 * @static
 * @const
 * @type {string|null}
 */
defineLazyProperty(browser, 'IOS_VERSION', () => {
  const match = USER_AGENT.match(/OS (\d+)_/i);

  if (match && match[1]) {
    return match[1];
  }
  return null;
});

/**
 * Whether or not this is an Android device.
 *
 * @static
 * @const
 * @type {Boolean}
 */
defineLazyProperty(browser, 'IS_ANDROID', () => (/Android/i).test(USER_AGENT));

/**
 * The detected Android version - or `null`.
 *
 * @static
 * @const
 * @type {number|string|null}
 */
defineLazyProperty(browser, 'ANDROID_VERSION', () => {
  // This matches Android Major.Minor.Patch versions
  // ANDROID_VERSION is Major.Minor as a Number, if Minor isn't available, then only Major is returned
  const match = USER_AGENT.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i);

  if (!match) {
    return null;
  }

  const major = match[1] && parseFloat(match[1]);
  const minor = match[2] && parseFloat(match[2]);

  if (major && minor) {
    return parseFloat(match[1] + '.' + match[2]);
  } else if (major) {
    return major;
  }
  return null;
});

/**
 * Whether or not this is a native Android browser.
 *
 * @static
 * @const
 * @type {Boolean}
 */
defineLazyProperty(browser, 'IS_NATIVE_ANDROID', () => {
  const webkitVersionMap = (/AppleWebKit\/([\d.]+)/i).exec(USER_AGENT);
  const appleWebkitVersion = webkitVersionMap ? parseFloat(webkitVersionMap.pop()) : null;

  return browser.IS_ANDROID && browser.ANDROID_VERSION < 5 && appleWebkitVersion < 537;
});

/**
 * Whether or not this is Mozilla Firefox.
 *
 * @static
 * @const
 * @type {Boolean}
 */
defineLazyProperty(browser, 'IS_FIREFOX', () => (/Firefox/i).test(USER_AGENT));

/**
 * Whether or not this is Microsoft Edge.
 *
 * @static
 * @const
 * @type {Boolean}
 */
defineLazyProperty(browser, 'IS_EDGE', () => (/Edge/i).test(USER_AGENT));

/**
 * Whether or not this is Google Chrome.
 *
 * This will also be `true` for Chrome on iOS, which will have different support
 * as it is actually Safari under the hood.
 *
 * @static
 * @const
 * @type {Boolean}
 */
defineLazyProperty(browser, 'IS_CHROME', () => {
  return !browser.IS_EDGE && ((/Chrome/i).test(USER_AGENT) || (/CriOS/i).test(USER_AGENT));
});

/**
 * The detected Google Chrome version - or `null`.
 *
 * @static
 * @const
 * @type {number|null}
 */
defineLazyProperty(browser, 'CHROME_VERSION', () => {
  const match = USER_AGENT.match(/(Chrome|CriOS)\/(\d+)/);

  if (match && match[2]) {
    return parseFloat(match[2]);
  }
  return null;
});

/**
 * The detected Internet Explorer version - or `null`.
 *
 * @static
 * @const
 * @type {number|null}
 */
defineLazyProperty(browser, 'IE_VERSION', () => {
  const result = (/MSIE\s(\d+)\.\d/).exec(USER_AGENT);
  let version = result && parseFloat(result[1]);

  if (!version && (/Trident\/7.0/i).test(USER_AGENT) && (/rv:11.0/).test(USER_AGENT)) {
    // IE 11 has a different user agent string than other IE versions
    version = 11.0;
  }

  return version;
});

/**
 * Whether or not this is desktop Safari.
 *
 * @static
 * @const
 * @type {Boolean}
 */
defineLazyProperty(browser, 'IS_SAFARI', () => {
  return (/Safari/i).test(USER_AGENT) && !browser.IS_CHROME && !browser.IS_ANDROID && !browser.IS_EDGE;
});

/**
 * Whether or not this is any flavor of Safari - including iOS.
 *
 * @static
 * @const
 * @type {Boolean}
 */
defineLazyProperty(browser, 'IS_ANY_SAFARI', () => (browser.IS_SAFARI || browser.IS_IOS) && !browser.IS_CHROME);

/**
 * Whether or not this is a Windows machine.
 *
 * @static
 * @const
 * @type {Boolean}
 */
defineLazyProperty(browser, 'IS_WINDOWS', () => (/Windows/i).test(USER_AGENT));

/**
 * Whether or not this device is touch-enabled.
 *
 * @static
 * @const
 * @type {Boolean}
 */
defineLazyProperty(browser, 'TOUCH_ENABLED', () => Dom.isReal() && (
  'ontouchstart' in window ||
  window.navigator.maxTouchPoints ||
  window.DocumentTouch && window.document instanceof window.DocumentTouch));

export default browser;
