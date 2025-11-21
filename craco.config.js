module.exports = {
  jest: {
    configure: (jestConfig) => {
      jestConfig.transformIgnorePatterns = [
        "node_modules/(?!(?:@reduxjs/toolkit|@standard-schema/utils)/)"
      ];
      return jestConfig;
    },
  },
};