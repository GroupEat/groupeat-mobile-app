'use strict';

module.exports = function(app) {
    // inject:start
    require('./cache')(app);
    require('./interceptors')(app);
    require('./translations')(app);
    // inject:end
};
