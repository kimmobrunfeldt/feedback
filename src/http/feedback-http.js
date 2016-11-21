const ex = require('../util/express');
const feedbackCore = require('../core/feedback-core');

const positiveFeedback = ex.createJsonRoute((req) => {
  const referer = req.headers.referer;
  if (!referer) {
    const err = new Error('Feedback request denied');
    err.status = 403;
    throw err;
  }
  console.log('referer', referer)

  // TODO: validation
  const feedback = {
    rating: 1,
    target: req.query.target,
    ipAddress: req.ip,
  };

  return feedbackCore.upsertFeedback(feedback);
});

const negativeFeedback = ex.createJsonRoute((req) => {
  const referer = req.headers.referer;
  if (!referer) {
    const err = new Error('Feedback request denied');
    err.status = 403;
    throw err;
  }

  // TODO: validation
  const feedback = {
    rating: -1,
    target: req.query.target,
    ipAddress: req.ip,
  };

  return feedbackCore.upsertFeedback(feedback);
});

module.exports = {
  positiveFeedback,
  negativeFeedback,
};
