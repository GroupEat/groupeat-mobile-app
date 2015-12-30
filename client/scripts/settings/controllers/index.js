'use strict';

module.exports = function(app) {
    // inject:start
    require('./settings')(app);
    // inject:end
};