const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
  ...defaultConfig,
  entry: {
    frontend: "./src/frontend/index.js",
    calendar: "./src/admin/calendar/index.js",
  },
  output: {
    ...defaultConfig.output,
    filename: "[name].js",
  },
};
