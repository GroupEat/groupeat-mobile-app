'use strict';

module.exports = function(app) {
    // inject:start
    require('./customer-storage')(app);
    require('./customer')(app);
    require('./customer-settings')(app);
    require('./ionic-user')(app);
    require('./phone-format')(app);
    // inject:end
};
