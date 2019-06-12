'use strict';
const { withdrawalService } = require('../services/index');
const logger = require('../../libs/logger');

module.exports = {
  withdrawCash(req, res, next) {
    return withdrawalService
      .withdrawCash(req.params.amount)
      .then(notes => {
        if (!notes) {
          const msg = `There is no way to withdraw ${amount} with current notes.`;
          logger.warn(msg);
          res.status(400).send([]);
        } else {
          res.status(200).send(notes);
        }
      })
      .catch(reason => {
        const error = new Error(reason);
        error.status = reason.toLowerCase() === 'invalid argument' ? 400 : 500;
        next(error);
      });
  }
};
