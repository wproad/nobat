const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
  ...defaultConfig,
  entry: {
    // booking: "./src/frontend/booking/index.js",
    cal: "./src/admin/cal/index.js",
    schedule: "./src/admin/schedule/index.js",
  },
  output: {
    ...defaultConfig.output,
    filename: "[name].js",
  },
};
