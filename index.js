"use strict";
const { connect } = require("./src/connect");
const { init, setState, forceUpdate } = require("./src/index");
const { state } = require("./src/container");

module.exports = {
  __esModule: true,
  connect,
  init,
  state,
  forceUpdate,
  setState
};
