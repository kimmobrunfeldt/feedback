const _ = require('lodash');

module.exports = function requireEnvs(vars) {
  const missingIndex = _.findIndex(vars, varName => _.isUndefined(process.env[varName]));

  if (missingIndex > -1) {
    const errMessage = `${vars[missingIndex]} environment variable not set`;
    throw new Error(errMessage);
  }
};
