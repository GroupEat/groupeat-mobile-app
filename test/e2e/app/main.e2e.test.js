'use strict';
var MainView = require('../views/Main.view');

describe('Main', function() {
    var mainView;
    beforeEach(function() {
        mainView = new MainView();
        //browser.ignoreSynchronization = true;
        mainView.get();
    });

    afterEach(function() {
        //browser.getLogs().then(function(logs) {console.log(JSON.stringify(logs));});
        browser.clearState();
    });

    afterAll(function(done) {
        // make sure you keep this otherwise screen shot reporter bypass the latest test
        process.nextTick(done);
    });

    it('should have a title', function() {
        expect(mainView.getCurrentPageTitle()).toEqual('GroupEat');
    });

    it('should include three titles for the three slides', function() {
      expect(element.all(by.css('.titles')).count()).toEqual(3);
    });

});
