const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");

// Remove the DependencyExtractionWebpackPlugin completely
const plugins = defaultConfig.plugins.filter(
  plugin => plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
);

module.exports = {
  ...defaultConfig,
  entry: {
    cal: "./src/admin/cal/index.js",
    schedule: "./src/admin/schedule/index.js",
    frontend: "./src/frontend/index.js",
  },
  output: {
    ...defaultConfig.output,
    filename: "[name].js",
    path: path.resolve(process.cwd(), "build"),
  },
  // CRITICAL: Set externals to empty array to bundle everything
  externals: [],
  plugins,
};
