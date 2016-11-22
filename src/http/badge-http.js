const { stripIndent } = require('common-tags');
const ex = require('../util/express');
const summaryCore = require('../core/summary-core');

const getSummary = ex.createRoute((req, res) => {
  // TODO: validation
  const target = req.params[0];
  summaryCore.getSummary(target)
    .then((summary) => {
      res.header('content-type', 'image/svg+xml');
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.header('Pragma', 'no-cache');
      res.header('Expires', 0);
      const content = summary ? _renderSummary(summary) : _renderEmpty();
      res.send(content);
    });
});

function _renderSummary(summary) {
  const ratio = (summary.sum + summary.totalCount) / (summary.totalCount * 2);

  return stripIndent`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="4">
      <g xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect fill="#ccc" x="0" y="0" width="100" height="4"/>
        <rect fill="#4c1" x="0" y="0" width="${ratio * 100}" height="4"/>
      </g>
    </svg>
  `;
}

function _renderEmpty() {
  return stripIndent`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="4">
      <g xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect fill="#4c1" x="0" y="0" width="100" height="4"/>
      </g>
    </svg>
  `;
}

module.exports = {
  getSummary,
};
