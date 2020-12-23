/**
 * a map of the environment to the variables we use. It's intended to "translate" from something
 * we can read/understand and use in code, instead of "magic strings" for specifying the name
 * of an environment variable
 */
export const EnvironmentMap = {
  pgUrl: 'DATABASE_URL',
  useSSL: 'USE_SSL',
  port: 'PORT',
  fork: 'USE_FORK',
  forkCount: 'FORK_COUNT',
};
