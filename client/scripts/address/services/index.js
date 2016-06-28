'use strict';

module.exports = function(app) {
    // inject:start
    require('./autocompleter')(app);
    require('./geocoder')(app);
    // inject:end
};
