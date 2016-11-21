exports.up = function(knex, Promise) {
  return knex.schema.createTable('feedbacks', function(table) {
    table.increments('id').primary().index();
    table.integer('rating').notNullable().index();
    table.string('target').notNullable().index();
    table.string('ip_address').notNullable().index();
    table.timestamp('created_at').index().notNullable().defaultTo(knex.fn.now());
  })
  .then(() => knex.raw('CREATE UNIQUE INDEX feedbacks_unique_index ON feedbacks (ip_address, target)'));
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('feedbacks');
};
