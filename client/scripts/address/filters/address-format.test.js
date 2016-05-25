'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular');
require('angular-mocks');
var app = require('../')('groupeat');
var filtername = 'addressFormat';
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
                expect(this.filter).to.be.defined;
            });

            it('should format the address', function() {
              var address = {
                street: '4 Privet Drive',
                postcode: 42000,
                city: 'Little Whinging',
                country: 'Great-Britain'
              };
              var expectedAddress = '4 Privet Drive, 42000 Little Whinging, Great-Britain';
                expect(this.filter(address)).to.equal(expectedAddress);
            });

        });
    });
});
