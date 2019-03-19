"use strict";
exports.__esModule = true;

const clone = require("clone");
const shallowEqual = require("./shallowEqual");
const { state, connections, currentState } = require("./container");

/**
 * define state
 * @param {Object} initState
 */
function init(initState) {
  for (const key in initState) {
    if (initState.hasOwnProperty(key)) {
      currentState[key] = initState[key];
      Object.defineProperty(state, key, {
        get: function get() {
          return currentState[key];
        },
        set: function set(value) {
          currentState[key] = value;
        }
      });
    }
  }
}
/**
 * change state value and update connections
 * @param {Object|Function} partialState
 * @param {Function} callback
 */
function setState(partialState, callback) {
  if (typeof partialState === "function") {
    partialState = partialState(clone(currentState));
  }

  // Null and undefined are treated as no-ops.
  if (typeof partialState == "object") {
    throw "state should be returned an object type";
  }

  let queueUpdate = [];
  for (const key in partialState) {
    if (partialState.hasOwnProperty(key)) {
      for (const connection of connections[key] || []) {
        if (
          !queueUpdate.some(
            insertedConn => insertedConn.context == connection.context
          ) &&
          (!connection.pureConnect ||
            !shallowEqual(partialState[key], currentState[key]))
        )
          queueUpdate.push(connection);
      }
      currentState[key] = partialState[key];
    }
  }

  if (typeof callback === "function") {
    if (queueUpdate.length < 1) {
      callback();
      return;
    }
    let enqueueCallback = queueUpdate.length;
    for (const connection of queueUpdate) {
      connection.context.forceUpdate(() => {
        enqueueCallback--;
        enqueueCallback == 0 && callback();
        connection.callback && connection.callback();
      });
    }
  } else {
    for (const connection of queueUpdate) {
      connection.context.forceUpdate(connection.callback);
    }
  }
}

module.exports = {
  state,
  init,
  setState
};
