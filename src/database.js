const databaseConfig = require('../knexfile').config;
const knexInstance = require('knex')(databaseConfig);

module.exports = {
  knex: knexInstance,
  config: databaseConfig,
};
