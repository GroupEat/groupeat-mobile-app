'use strict';

module.exports = function(app) {
    // inject:start
    require('./cart')(app);
    require('./group-order')(app);
    require('./order')(app);
    require('./predefined-addresses')(app);
    // inject:end
};
