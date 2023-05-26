const config = {
  mongodb: {
    url: 'mongodb://localhost:30000,localhost:30001,localhost:30002/',

    databaseName: 'starter',

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;
