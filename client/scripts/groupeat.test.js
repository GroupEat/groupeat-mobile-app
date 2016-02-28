'use strict';
var angular = require('angular');
require('angular-mocks');
var app = require('./groupeat.js');

describe('groupeat', function() {

    beforeEach(function() {
        angular.mock.module(app.name);
    });

    it('should be defined', function() {
        expect(app).to.be.defined;
    });

});
