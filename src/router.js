const express = require('express');
const feedback = require('./http/feedback-http');
const badge = require('./http/badge-http');

function createRouter() {
  const router = express.Router();
  router.get('/positive', feedback.positiveFeedback);
  router.get('/negative', feedback.negativeFeedback);

  // Match "/badges/*.svg", * will be available as req.params[0]
  router.get(/^\/badges\/(.+).svg$/, badge.getSummary);
  return router;
}

module.exports = createRouter;
