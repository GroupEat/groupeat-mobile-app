'use strict';

module.exports = function(app) {
    // inject:start
    require('./push')(app);
    // inject:end
};
