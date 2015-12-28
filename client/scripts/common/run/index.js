'use strict';

module.exports = function(app) {
    // inject:start
    require('./form-validation')(app);
    require('./globalization')(app);
    // inject:end
};
