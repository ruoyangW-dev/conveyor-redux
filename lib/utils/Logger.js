/* global localStorage */
var localStorageKey = 'debug';
export var isEnabled = function isEnabled(key) {
  return localStorage.getItem(key) !== null;
};
export var enable = function enable() {
  if (!isEnabled(localStorageKey)) {
    localStorage.setItem(localStorageKey, '1'); // arbitrary value
  }
};
export var log = function log() {
  var _console;

  if (!isEnabled()) {
    return;
  }

  (_console = console).log.apply(_console, arguments);
};
export var epicError = function epicError(epicName, context, error) {
  if (!isEnabled()) {
    return;
  }

  console.group("".concat(epicName, " error"));
  console.log('context');
  console.log(context);
  console.log('\nerror');
  console.log(error);
  console.groupEnd();
}; // unhandled error caught by root epic

export var rootEpicError = function rootEpicError(epicName, error) {
  if (!isEnabled()) {
    return;
  }

  console.group("unhandled error in ".concat(epicName));
  console.log(error);
  console.groupEnd();
};