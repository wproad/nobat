const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");

// Remove the DependencyExtractionWebpackPlugin completely
const plugins = defaultConfig.plugins.filter(
  plugin => plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
);

module.exports = {
  ...defaultConfig,
  entry: {
    booking: "./src/frontend/booking/index.js",
    cal: "./src/admin/cal/index.js",
    schedule: "./src/admin/schedule/index.js",
    bookingNew: "./src/bookingNew/index.js",
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
