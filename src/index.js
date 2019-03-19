"use strict";
exports.__esModule = true;

const clone = require("clone");
const shallowEqual = require("./shallowEqual");
const { state, connections, currentState } = require("./container");

function init(stateObject) {
  for (const key in stateObject) {
    if (stateObject.hasOwnProperty(key)) {
      currentState[key] = clone(stateObject[key]);
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

function setState(partialState, callback) {
  if (typeof partialState === "function") {
    partialState = partialState(currentState);
  }

  // Null and undefined are treated as no-ops.
  if (partialState === null || partialState === undefined) {
    return;
  }

  let enqueueUpdate = [];
  for (const key in partialState) {
    if (partialState.hasOwnProperty(key)) {
      for (const connection of connections[key] || []) {
        if (
          !enqueueUpdate.some(
            insertedConn => insertedConn.context == connection.context
          ) &&
          (!connection.pureConnect ||
            !shallowEqual(partialState[key], currentState[key]))
        )
          enqueueUpdate.push(connection);
      }
      currentState[key] = partialState[key];
    }
  }

  if (typeof callback === "function") {
    if (enqueueUpdate.length < 1) {
      callback();
      return;
    }
    let enqueueCallback = enqueueUpdate.length;
    for (const connection of enqueueUpdate) {
      connection.context.forceUpdate(() => {
        enqueueCallback--;
        enqueueCallback == 0 && callback();
        connection.callback && connection.callback();
      });
    }
  } else {
    for (const connection of enqueueUpdate) {
      connection.context.forceUpdate(connection.callback);
    }
  }
}

module.exports = {
  state,
  init,
  setState
};
