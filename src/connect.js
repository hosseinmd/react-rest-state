"use strict";

const { connections } = require("./container");

/**
 * connect component or function to few state
 * @param {Component|Function} context
 * @param {Array<String>} states
 * @param {Object} options
 * @param {Boolean} options.pureConnect
 * @param {Function} options.callback
 * @returns {Function} run this for disconnect
 */
function connect(context, states = [], options = {}) {
  if (!(typeof context == "object" || typeof context == "function"))
    throw "context should be React.component or function";

  if (typeof context == "function") {
    context = createContext(context);
  }
  addToConnections(context, states, options);

  return createUnsubscribe(context, states);
}

function createContext(func) {
  return {
    forceUpdate: async function(callback) {
      func();
      callback && callback();
    }
  };
}

function addToConnections(context, states = [], options = {}) {
  for (const name of states) {
    if (connections.hasOwnProperty(name)) {
      connections[name].push({ ...options, context });
    } else {
      connections[name] = [{ ...options, context }];
    }
  }
}

function createUnsubscribe(context, states) {
  return function() {
    for (const name of states) {
      if (connections[name]) {
        connections[name] = connections[name].filter(
          connection => connection.context != context
        );
      }
    }
  };
}

exports.connect = connect;
exports.createContext = createContext;
exports.addToConnections = addToConnections;
exports.createUnsubscribe = createUnsubscribe;
