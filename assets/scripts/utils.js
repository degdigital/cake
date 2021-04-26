const validateEnvVars = (envVars = {}) =>
  Object.values(envVars).every(
    envVar => typeof envVar !== 'undefined' || envVar.length === 0
  );

module.exports = {
  validateEnvVars
};
