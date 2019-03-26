/* eslint-disable */

/**
 * This would not normally be counted as an i18n key, but after applying a babel
 * transform to rewrite it as `i18n('key1')`, it will!
 */
someCrazyThingThatRequiresABabelTransform({
  foo: 'key1',
});
