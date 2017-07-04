const _ = require('lodash');
const BPromise = require('bluebird');
const { stripIndent } = require('common-tags');
const ex = require('../util/express');
const summaryCore = require('../core/summary-core');

const getSummary = ex.createRoute((req, res) => {
  // TODO: validation
  const target = req.params[0];
  summaryCore.getSummary(target)
    .then((summary) => {
      res.header('content-type', 'image/svg+xml');
      res.header('Cache-Control', 'private');
      res.header('Pragma', 'no-cache');
      res.header('Expires', 0);
      const content = summary ? _renderSummary(summary) : _renderEmpty();
      res.send(content);
    });
});

const getThumbsUp = ex.createRoute((req, res) => {
  // TODO: validation
  const target = req.params[0];
  BPromise.props({
    summary: summaryCore.getSummary(target),
    previousFeedback: summaryCore.getFeedbackByIp(req.ip, target),
  })
    .then((result) => {
      res.header('content-type', 'image/svg+xml');
      res.header('Cache-Control', 'private');
      res.header('Pragma', 'no-cache');
      res.header('Expires', 0);
      res.render('thumbs-up', {
        positiveCount: result.summary.positiveCount,
        color: _.get(result.previousFeedback, 'rating') === 1 ? '#4c1' : '#6D6D6D',
      });
    });
});

const getThumbsDown = ex.createRoute((req, res) => {
  // TODO: validation
  const target = req.params[0];
  BPromise.props({
    summary: summaryCore.getSummary(target),
    previousFeedback: summaryCore.getFeedbackByIp(req.ip, target),
  })
    .then((result) => {
      res.header('content-type', 'image/svg+xml');
      res.header('Cache-Control', 'private');
      res.header('Pragma', 'no-cache');
      res.header('Expires', 0);
      res.render('thumbs-down', {
        negativeCount: result.summary.negativeCount,
        color: _.get(result.previousFeedback, 'rating') === -1 ? '#d6604a' : '#6D6D6D',
      });
    });
});


function _renderSummary(summary) {
  const ratio = (summary.sum + summary.totalCount) / (summary.totalCount * 2);

  return stripIndent`
    <svg xmlns="http://www.w3.org/2000/svg" width="107" height="8">
      <g xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect fill="#ccc" x="0" y="0" width="100" height="4"/>
        <rect fill="#4c1" x="0" y="0" width="${ratio * 100}" height="4"/>
      </g>
    </svg>
  `;
}

function _renderEmpty() {
  return stripIndent`
    <svg xmlns="http://www.w3.org/2000/svg" width="107" height="8">
      <g xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect fill="#4c1" x="0" y="0" width="100" height="4"/>
      </g>
    </svg>
  `;
}

module.exports = {
  getSummary,
  getThumbsUp,
  getThumbsDown,
};
