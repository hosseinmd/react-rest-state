"use strict";

const { connections } = require("./container");

/**
 * connect component or function to few state
 * @param {Component|Function} context
 * @param {Array<String>} stateNames
 * @param {Object} options
 * @param {Boolean} options.pureConnect
 * @param {Function} options.callback
 * @returns {Function} run this for disconnect
 */
function connect(context, stateNames = [], options = {}) {
  if (!(typeof context == "object" || typeof context == "function"))
    throw "context should be React.component or function";

  if (typeof context == "function") {
    let contextFunc = context;
    context = {
      forceUpdate: async function(callback) {
        contextFunc();
        callback && callback();
      }
    };
  }
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

exports.connect = connect;
