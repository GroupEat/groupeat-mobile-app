'use strict';

module.exports = function(app) {
    // inject:start
    require('./address')(app);
    require('./customer-information-checker')(app);
    require('./customer-settings')(app);
    require('./customer-storage')(app);
    require('./customer')(app);
    require('./ionic-user')(app);
    require('./phone-format')(app);
    // inject:end
};
