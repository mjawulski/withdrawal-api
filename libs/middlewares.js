'use strict';
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const errorHandler = require('errorhandler');
const validator = require('express-validator');
const helmet = require('helmet');
const methodOverride = require('method-override');
const morgan = require('morgan');
const responseTime = require('response-time');
const logger = require('./logger');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = app => {
  app.use(responseTime());
  app.use(helmet());
  app.use(
    morgan(
      ':remote-addr - :remote-user ":method :url HTTP/:http-version" status: :status :res[content-length] - :response-time ms ":referrer" ":user-agent"',
      {
        stream: logger.stream
      }
    )
  );
  app.use(compression());
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
  app.use(validator());
  app.use(methodOverride('X-HTTP-Method-Override'));
  app.use((req, res, next) => {
    if (isProduction && !(req.secure || req.headers['x-forwarded-proto'] === 'https')) {
      res.redirect(`https://${req.hostname}:${process.env.PORT_HTTPS}${req.url}`);
    } else {
      next();
    }
  });

  if (!isProduction) {
    app.use(errorHandler({ log: errorNotification }));
  }

  function errorNotification(err, str, req) {
    const title = `Error in ${req.method} ${req.url}`;
    logger.error(title, str);
  }
};
