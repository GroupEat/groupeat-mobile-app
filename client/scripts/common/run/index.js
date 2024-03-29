'use strict';

module.exports = function(app) {
    // inject:start
    require('./form-validation')(app);
    require('./globalization')(app);
    require('./message-backdrop')(app);
    require('./update')(app);
    // inject:end
};
