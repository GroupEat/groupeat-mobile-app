'use strict';

module.exports = function(app) {
    // inject:start
    require('./restaurant')(app);
    // inject:end
};