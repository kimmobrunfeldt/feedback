const { oneLine } = require('common-tags');
const { knex } = require('../database');

function upsertFeedback(feedback) {
  // XXX: Postgres 9.5 specific query
  // EXCLUDED is an automatic table Postgres creates, see:
  // http://www.postgresql.org/docs/9.5/static/sql-insert.html
  return knex.raw(oneLine`
    INSERT INTO feedbacks (
      target,
      rating,
      ip_address
    ) VALUES (:target, :rating, :ipAddress)
    ON CONFLICT (ip_address, target)
    DO UPDATE SET
      target = EXCLUDED.target,
      rating = EXCLUDED.rating
    RETURNING *
  `, feedback)
    .then(result => result.rows[0]);
}

module.exports = {
  upsertFeedback,
};
