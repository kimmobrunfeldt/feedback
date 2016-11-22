const _ = require('lodash');
const { oneLine } = require('common-tags');
const { knex } = require('../database');

function getSummary(target) {
  return knex.raw(oneLine`
    SELECT
      SUM(rating) AS sum,
      COUNT(*) as total_count,
      SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS positive_count,
      SUM(CASE WHEN rating = -1 THEN 1 ELSE 0 END) AS negative_count,
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

function getFeedbackByIp(ipAddress, target) {
  return knex.raw(oneLine`
    SELECT
      *
    FROM feedbacks
    WHERE
      ip_address = ? AND
      target = ?
  `, [ipAddress, target])
    .then((result) => {
      if (_.isEmpty(result.rows)) {
        return null;
      }

      return _feedbackRowToObj(result.rows[0]);
    });
}

function _summaryRowToObj(row) {
  return {
    target: row.target,
    sum: Number(row.sum),
    totalCount: Number(row.total_count),
    positiveCount: Number(row.positive_count),
    negativeCount: Number(row.negative_count),
  };
}

function _feedbackRowToObj(row) {
  return {
    id: row.id,
    target: row.target,
    ipAddress: row.ip_address,
    rating: Number(row.rating),
    createdAt: row.created_at,
  };
}

module.exports = {
  getSummary,
  getFeedbackByIp,
};
