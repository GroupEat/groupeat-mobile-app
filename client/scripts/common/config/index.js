'use strict';

module.exports = function(app) {
    // inject:start
    require('./interceptors')(app);
    require('./translations')(app);
    // inject:end
};
