const _ = require('lodash');
const { oneLine } = require('common-tags');
const { knex } = require('../database');

function getSummary(target) {
  return knex.raw(oneLine`
    SELECT
      SUM(rating) AS sum,
      COUNT(*) as total_count,
      target
    FROM feedbacks
    WHERE target = ?
    GROUP BY target
  `, [target])
    .then((result) => {
      if (_.isEmpty(result.rows)) {
        return null;
      }

      return _summaryRowToObj(result.rows[0]);
    });
}

function _summaryRowToObj(row) {
  return {
    target: row.target,
    sum: Number(row.sum),
    totalCount: Number(row.total_count),
  };
}

module.exports = {
  getSummary,
};
