"use strict";

const { connections } = require("./container");

/**
 *
 * @param {*} context
 * @param {*} stateNames
 * @param {object} options
 * @param {boolean} options.pureConnect
 * @param {function} options.callback
 *
 *
 */
function connect(context, stateNames = [], options = {}) {
  if (!(typeof context == "object" || typeof context == "function"))
    throw "context should be React.component or function";

  if (typeof context == "function") context = { forceUpdate: context };

  for (const name of stateNames) {
    if (connections.hasOwnProperty(name)) {
      connections[name].push({ ...options, context });
    } else {
      connections[name] = [{ ...options, context }];
    }
  }

  return function() {
    for (const name of stateNames) {
      if (connections[name]) {
        connections[name] = connections[name].filter(
          connection => connection.context != context
        );
      }
    }
  };
}

module.exports = connect;
