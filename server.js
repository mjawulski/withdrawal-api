'use strict';
const express = require('express');
const consign = require('consign');
const app = express();

consign()
  .include('libs/logger.js')
  .then('config/config.js')
  .then('libs/middlewares.js')
  .then('app/routes')
  .then('libs/boot.js')
  .into(app);

module.exports = app;
