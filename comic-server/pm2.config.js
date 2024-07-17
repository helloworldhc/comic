module.exports = {
  apps: [{
    script: 'src/index.js',
    name: 'app',
    exec_mode: 'cluster',
    instance_var: 'INSTANCE_ID',
    env_production: {
      NODE_ENV: 'pro'
    },
    env_development: {
      NODE_ENV: 'dev'
    }
  }]
};
