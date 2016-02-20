'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular');
require('angular-mocks');
var app = require('../')('groupeat');
var filtername = 'timeLabel';
describe(app.name, function() {

    describe('Filters', function() {

        describe(filtername, function() {

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function($injector) {
                this.$filter = $injector.get('$filter');
                this.filter = this.$filter(filtername);
            }));

            it('should be defined', function() {
                expect(this.filter).toBeDefined();
            });

        });
    });
});
