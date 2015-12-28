'use strict';

module.exports = function(app) {
    // inject:start
    require('./interceptors')(app);
    // inject:end
};
