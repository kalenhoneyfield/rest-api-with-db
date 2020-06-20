'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

//verify that we can connect to the DB
const db = require('./models');
(async () => {
  try {
    console.log(`Attempting to connect to the database...`);
    await db.sequelize.authenticate().then(() => console.log('Connection Established'));
  } catch (err) {
    console.log(`It looks like there was an error connecting to the database: ${err.message}`);
  }
})();

//pull in routes
const userRoute = require('./routes/userRoute');
const courseRoute = require('./routes/courseRoute');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// Setup request body JSON parsing.
app.use(express.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TODO setup your api routes here

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

app.use('/api/users', userRoute);
app.use('/api/courses', courseRoute);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
