'use strict';

module.exports = function(app) {
    // inject:start
    require('./push-config')(app);
    // inject:end
};
