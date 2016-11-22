const ex = require('../util/express');
const feedbackCore = require('../core/feedback-core');

const positiveFeedback = ex.createRoute((req, res) => {
  return _giveFeedback(req, res, 1);
});

const negativeFeedback = ex.createRoute((req, res) => {
  return _giveFeedback(req, res, -1);
});

function _giveFeedback(req, res, rating) {
  const referer = req.headers.referer;
  if (!referer) {
    res.status(403);
    return res.render('feedback-denied');
  }

  // TODO: validation
  const feedback = {
    rating,
    target: req.query.target,
    ipAddress: req.ip,
  };

  return feedbackCore.upsertFeedback(feedback)
    .then(() => {
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.header('Pragma', 'no-cache');
      res.header('Expires', 0);
      const template = rating === 1 ? 'positive' : 'negative';
      res.render(template, { redirectUrl: referer });
    });
}

module.exports = {
  positiveFeedback,
  negativeFeedback,
};
