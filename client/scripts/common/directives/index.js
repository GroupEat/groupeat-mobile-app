'use strict';

module.exports = function(app) {
    // inject:start
    require('./message-backdrop')(app);
    require('./timer')(app);
    // inject:end
};
