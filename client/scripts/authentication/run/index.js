'use strict';

module.exports = function(app) {
    // inject:start
    require('./roles')(app);
    // inject:end
};
