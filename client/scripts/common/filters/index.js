'use strict';

module.exports = function(app) {
    // inject:start
    require('./time-format')(app);
    require('./time-to-range')(app);
    require('./range-to-time')(app);
    // inject:end
};
