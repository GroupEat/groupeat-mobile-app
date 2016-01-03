'use strict';

module.exports = function(app) {
    // inject:start
    require('./restaurants')(app);
    // inject:end
};