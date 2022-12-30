const items = require('./fakeDb');
const express = require('express');
const ExpressError = require('./expressError');
const itemRoutes = require('./itemRoutes');
const middleware = require('./middleware');
const morgan = require('morgan');
const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use('/items', itemRoutes);

// ********************************************************************
app.use((req, res) => {
  //   return new ExpressError(
  //     'That page must have pasted away.  Please try another',
  //     404
  //   );
  //   return new ExpressError('No longer here!', 404);
  return res
    .status(404)
    .send('That page cannot be found.  Please try another page.');
});

app.use(function (err, req, res, next) {
  let status = err.status || 500;
  let message = err.msg || 'That is a big error!';

  return res.status(status).json({
    error: { message, status },
  });
});
// *********************************************************************

module.exports = app;
