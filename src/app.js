const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const expressHandlebars  = require('express-handlebars');
const errorResponder = require('./middleware/error-responder');
const errorLogger = require('./middleware/error-logger');
const createRouter = require('./router');

function createApp() {
  const app = express();

  // Heroku's load balancer can be trusted
  app.enable('trust proxy');
  app.disable('x-powered-by');

  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(cors());
  app.use(compression({
    // Compress everything over 10 bytes
    threshold: 10,
  }));

  app.set('views', './src/views');
  app.engine('hbs', expressHandlebars({ extname: '.hbs' }));
  app.set('view engine', 'hbs');

  // Initialize routes
  const router = createRouter();
  app.use('/', router);

  app.use(errorLogger());
  app.use(errorResponder());

  return app;
}

module.exports = createApp;
