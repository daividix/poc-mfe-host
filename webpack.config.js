const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  remotes: {
    "poc-mfe-banner": "http://localhost:4201/remoteEntry.js",
    "poc-mfe-login": "http://localhost:4202/remoteEntry.js",
    "poc-mfe-home": "http://localhost:4203/remoteEntry.js",
    "poc-mfe-profile": "http://localhost:4204/remoteEntry.js"   
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
  sharedMappings: ["@poc-mfe/shared"]
});
