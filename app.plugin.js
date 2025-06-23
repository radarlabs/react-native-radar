// Handle ES module import for the plugin
const plugin = require('./plugin/build');

// Export the plugin function that handles ES module imports
module.exports = plugin.default;