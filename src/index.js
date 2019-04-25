"use strict";
exports.__esModule = true;

const clone = require("clone");
const shallowEqual = require("./shallowEqual");
const { state, connections } = require("./container");

async function _updateState(partialState, callback) {
  let queueUpdate = [];
  for (const key in partialState) {
    if (partialState.hasOwnProperty(key)) {
      for (const connection of connections[key] || []) {
        if (
          !queueUpdate.some(
            insertedConn => insertedConn.context == connection.context
          ) &&
          (!connection.pureConnect ||
            !shallowEqual(partialState[key], state[key]))
        )
          queueUpdate.push(connection);
      }
      state[key] = partialState[key];
    }
  }
  _update(queueUpdate, callback);
}

function _update(queueUpdate, callback) {
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

/**
 * force update states connections
 * @param {Array} statesName
 * @param {Function} callback
 */
async function forceUpdate(statesName, callback) {
  let queueUpdate = [];
  for (const stateName of statesName) {
    for (const connection of connections[stateName] || []) {
      if (
        !queueUpdate.some(
          insertedConn => insertedConn.context == connection.context
        )
      )
        queueUpdate.push(connection);
    }
  }
  _update(queueUpdate, callback);
}

/**
 * define state
 * @param {Object} initState
 */
function init(initState) {
  for (const key in initState) {
    if (initState.hasOwnProperty(key)) {
      state[key] = initState[key];
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
    partialState = partialState(clone(state));
  }

  // Null and undefined are treated as no-ops.
  if (typeof partialState != "object") {
    throw "state should be returned an object type";
  }

  _updateState(partialState, callback);
}

module.exports = {
  init,
  forceUpdate,
  setState
};
