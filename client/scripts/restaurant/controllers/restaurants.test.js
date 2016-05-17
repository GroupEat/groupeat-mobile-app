'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular');
require('angular-mocks');
var app = require('../')('groupeat');
var controllername = 'RestaurantsCtrl';
describe(app.name, function() {

  describe('Controllers', function() {

    describe(controllername, function() {

      beforeEach(function() {
        angular.mock.module(app.name);
      });

      beforeEach(inject(function($injector) {
        this.$controller = $injector.get('$controller');
        this.$httpBackend = $injector.get('$httpBackend');
        this.$q = $injector.get('$q');
        this.$scope = $injector.get('$rootScope').$new();
        this.$state = $injector.get('$state');
        this.sandbox = sinon.sandbox.create();
        this.ControllerPromiseHandler = $injector.get(app.namespace.common+'.ControllerPromiseHandler');
        this.Customer = $injector.get(app.namespace.customer+'.Customer');
        this.CustomerInformationChecker = $injector.get(app.namespace.customer+'.CustomerInformationChecker');
        this.CustomerStorage = $injector.get(app.namespace.customer+'.CustomerStorage');
        this.GroupOrder = $injector.get(app.namespace.orders+'.GroupOrder');
        this.Network = $injector.get(app.namespace.common+'.Network');
        this._ = $injector.get(app.namespace.common+'.Lodash');
        this.Order = $injector.get(app.namespace.orders+'.Order');
        this.Popup = $injector.get(app.namespace.common+'.Popup');
        this.Restaurant = $injector.get(app.name+'.Restaurant');

        this.controller = this.$controller(app.name + '.' + controllername + ' as vm', {
          '$scope': this.$scope,
          '$state': this.$state,
          'ControllerPromiseHandler': this.ControllerPromiseHandler,
          'Customer': this.Customer,
          'CustomerInformationChecker': this.CustomerInformationChecker,
          'CustomerStorage': this.CustomerStorage,
          'GroupOrder': this.GroupOrder,
          'Network': this.Network,
          '_': this._,
          'Order': this.Order,
          'Popup': this.Popup,
          'Restaurant': this.Restaurant
        });
        this.$httpBackend.whenGET(/^translations\/.*/).respond('{}');
        this.$httpBackend.whenGET('/restaurants?opened=1&around=1&latitude=1&longitude=1&include=openingWindows').respond('{}');
      }));

      afterEach(function() {
        this.sandbox.restore();
      });

      it('should be defined', function() {
        expect(this.controller).to.be.defined;
      });

      it('should initially have no restaurants loaded', function() {
        this.$scope.restaurants.should.be.empty;
      });

      describe('RestaurantsCtrl#onRestaurantTouch', function(){
        beforeEach(function(){
          this.$scope.address = {
            latitude: 1,
            longitude: 1
          };
        });

        it('should check for missing information is the customer account is activated', function() {
          this.sandbox.stub(this.CustomerInformationChecker, 'check').returns(this.$q.defer().promise);
          this.$scope.onRestaurantTouch(1);
          this.$httpBackend.flush();

          this.$scope.$digest();
          this.CustomerInformationChecker.check.should.have.been.called;
        });

        xit('should call GroupOrder#get if customer information are available', function() {
          this.sandbox.stub(this.CustomerInformationChecker, 'check').returns(this.$q.when({}));
          this.sandbox.stub(this.GroupOrder, 'getFromAddress').returns(this.$q.defer().promise);
          this.$scope.onRestaurantTouch(1);
          this.$httpBackend.flush();
          this.$scope.$digest();
          this.GroupOrder.getFromAddress.should.have.been.called;
        });

        it('should call Restaurant#checkGroupOrders when the group orders were fetched', function() {
          this.sandbox.stub(this.CustomerInformationChecker, 'check').returns(this.$q.when({}));
          var groupOrders = [];
          this.sandbox.stub(this.GroupOrder, 'getFromAddress').returns(this.$q.when(groupOrders));
          this.sandbox.stub(this.Restaurant, 'checkGroupOrders').returns(this.$q.defer().promise);
          var restaurant = {
            id: 1
          };
          this.$scope.onRestaurantTouch(restaurant);
          this.$httpBackend.flush();
          this.$scope.$digest();
          this.Restaurant.checkGroupOrders.should.have.been.calledWithExactly(1, groupOrders);
        });

        it('should change the state to settings if all previous chains were resolved', function() {
          this.sandbox.stub(this.CustomerInformationChecker, 'check').returns(this.$q.when({}));
          this.sandbox.stub(this.GroupOrder, 'getFromAddress').returns(this.$q.when({}));
          this.sandbox.stub(this.Restaurant, 'checkGroupOrders').returns(this.$q.when());
          this.sandbox.stub(this.$state, 'go');

          this.sandbox.spy(this.Order, 'setCurrentOrder');

          var restaurant = {
            deliveryCapacity: 10,
            discountPolicy: 'discountPolicy',
            id: 1,
            closingAt: '2015-01-30 16:39:26'
          };
          this.$scope.onRestaurantTouch(restaurant);
          this.$httpBackend.flush();
          this.$scope.$digest();

          this.Order.setCurrentOrder.should.have.been.calledWithExactly(null, null, 0, 10, 'discountPolicy', 0, restaurant.closingAt);
          this.$state.go.should.have.been.calledWithExactly('app.restaurant-menu', { isRestaurantOpen: false, restaurantId: restaurant.id });
        });

      });

      describe('RestaurantsCtrl#onReload', function() {

        var address = {
            latitude: 1,
            longitude: 1
        };

        beforeEach(function(){
          this.$scope.initialState = 'initial';
          this.sandbox.spy(this.$scope, '$broadcast');
        });

        afterEach(function(){
          this.sandbox.restore();
        });

        it('should show an absence of connectivity message backdrop when there is no connectivity', function() {
          var errorKey = 'noNetwork';
          var expectedPromise = this.$q.reject(errorKey);
          this.sandbox.spy(this.ControllerPromiseHandler, 'handle');
          this.sandbox.stub(this.Network, 'hasConnectivity').returns(this.$q.reject(errorKey));
          this.$scope.onReload();
          this.$scope.$digest();
          this.ControllerPromiseHandler.handle.should.have.been.calledWithMatch(expectedPromise, 'initial');
        });

        it('should broadcast scroll.refreshComplete when there is no connectivity', function() {
          this.sandbox.stub(this.Network, 'hasConnectivity').returns(this.$q.reject('noNetwork'));
          this.$scope.onReload();
          this.$scope.$digest();
          this.$scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete');
        });

        it('should call ControllerPromiseHandler.handle with a rejected promise if the server cannot get the list of restaurants', function() {
          var expectedPromise = this.$q.reject();
          this.sandbox.spy(this.ControllerPromiseHandler, 'handle');
          this.sandbox.stub(this.Network, 'hasConnectivity').returns(this.$q.when({}));
          this.sandbox.stub(this.CustomerStorage, 'getAddress').returns(address);
          this.sandbox.stub(this.Restaurant, 'getFromAddress').returns(this.$q.reject());
          this.$scope.onReload();
          this.$scope.$digest();
          this.Restaurant.getFromAddress.should.have.been.calledWithExactly(address);
          this.ControllerPromiseHandler.handle.should.have.been.calledWithMatch(expectedPromise, 'initial');
        });

        it('should eventually broadcast scroll.refreshComplete if the server cannot get the list of restaurants', function() {
          this.sandbox.stub(this.Network, 'hasConnectivity').returns(this.$q.when({}));
          this.sandbox.stub(this.CustomerStorage, 'getAddress').returns(address);
          this.sandbox.stub(this.Restaurant, 'getFromAddress').returns(this.$q.reject());
          this.$scope.onReload();
          this.$scope.$digest();
          this.$scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete');
        });

        it('should call ControllerPromiseHandler.handle with a promise rejected with noRestaurants when no restaurants are returned by the server', function() {
          var expectedPromise = this.$q.reject('noRestaurants');
          this.sandbox.stub(this.Network, 'hasConnectivity').returns(this.$q.when({}));
          this.sandbox.stub(this.CustomerStorage, 'getAddress').returns(address);
          this.sandbox.stub(this.Restaurant, 'getFromAddress').returns(this.$q.when([]));
          this.sandbox.spy(this.ControllerPromiseHandler, 'handle');

          this.$scope.onReload();
          this.$scope.$digest();
          this.ControllerPromiseHandler.handle.should.have.been.calledWithMatch(expectedPromise, 'initial');
        });

        it('should call ControllerPromiseHandler.handle with a resolved promise if at least one restaurant is returned by the server', function() {
          var expectedPromise = this.$q.when();
          this.sandbox.stub(this.Network, 'hasConnectivity').returns(this.$q.when({}));
          this.sandbox.stub(this.CustomerStorage, 'getAddress').returns(address);
          this.sandbox.stub(this.Restaurant, 'getFromAddress').returns(this.$q.when(['restaurant']));
          this.sandbox.spy(this.ControllerPromiseHandler, 'handle');
          this.$scope.onReload();
          this.$scope.$digest();
          this.ControllerPromiseHandler.handle.should.have.been.calledWithMatch(expectedPromise, 'initial');
        });

        it('should load restaurants in the scope if at least one is returned by the server', function() {
          var restaurants = ['firstRestaurant', 'secondRestaurant'];
          this.sandbox.stub(this.Network, 'hasConnectivity').returns(this.$q.when({}));
          this.sandbox.stub(this.CustomerStorage, 'getAddress').returns(address);
          this.sandbox.stub(this.Restaurant, 'getFromAddress').returns(this.$q.when(restaurants));
          this.$scope.onReload();
          this.$scope.$digest();
          this.$scope.restaurants.should.equal(restaurants);
        });

        it('should eventually broadcast scroll.refreshComplete if the server returns a list of restaurants', function() {
          this.sandbox.stub(this.Network, 'hasConnectivity').returns(this.$q.when({}));
          this.sandbox.stub(this.CustomerStorage, 'getAddress').returns(address);
          this.sandbox.stub(this.Restaurant, 'getFromAddress').returns(this.$q.when(['restaurant']));
          this.$scope.onReload();
          this.$scope.$digest();
          this.$scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete');
        });

      });

      describe('RestaurantsCtrl $on $ionicView.afterEnter', function() {
        it('should call onReload when receiving the event', function() {
          this.sandbox.stub(this.$scope, 'onReload');
          this.$scope.$broadcast('$ionicView.afterEnter');
          this.$scope.onReload.should.have.been.called;
        });
      });

    });
  });
});
