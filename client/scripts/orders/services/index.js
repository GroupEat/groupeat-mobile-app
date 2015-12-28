'use strict';

module.exports = function(app) {
    // inject:start
    require('./group-order')(app);
    require('./order')(app);
    // inject:end
};
