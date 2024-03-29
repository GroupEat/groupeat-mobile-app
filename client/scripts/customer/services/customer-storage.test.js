'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular');
require('angular-mocks');
var app = require('../')('groupeat');
var servicename = 'CustomerStorage';
describe(app.name, function() {

    describe('Services', function() {

        describe(servicename, function() {

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function($injector) {
                this.service = $injector.get(app.name + '.' + servicename);
            }));

            it('should be defined', function() {
                expect(this.service).to.be.defined;
            });

        });
    });
});
