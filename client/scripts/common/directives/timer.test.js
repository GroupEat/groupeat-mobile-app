'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular');
require('angular-mocks');
var app = require('../')('groupeat');
var directivename = 'timer';
var unitHelper = require('unitHelper');

describe(app.name, function() {

    describe('Directives', function() {

        describe(directivename, function() {

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function($injector) {
                this.$templateCache = $injector.get('$templateCache');
                this.$compile = $injector.get('$compile');
                this.$scope = $injector.get('$rootScope').$new();
                $injector.get('$httpBackend').whenGET(/translations/).respond(200);
            }));

            it('should succeed', function() {
                var element = unitHelper.compileDirective.call(this, directivename, '<ge-timer></ge-timer>');
                expect(element.html().trim()).to.be.defined;
            });

        });
    });
});
