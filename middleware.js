const ExpressError = require('./expressError');

function logger(req, res, next) {
  console.log(`Recieved a ${req.method} request sent to: ${req.path}`);
  return next();
}

function checkForPassword(req, res, next) {
  try {
    if (req.query.password != 'monkeybreath') {
      throw new ExpressError('Missing password', 402);
    }
    return next();
  } catch (e) {
    return next(e);
  }
}

module.exports = { logger, checkForPassword };
