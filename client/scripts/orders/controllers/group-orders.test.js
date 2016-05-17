'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular');
require('angular-mocks');
var app = require('../')('groupeat');
var controllername = 'GroupOrdersCtrl';
describe(app.name, function() {

  describe('Controllers', function() {

    describe(controllername, function() {

      beforeEach(function() {
        angular.mock.module(app.name);
      });

      beforeEach(inject(function($injector) {
        this.$controller = $injector.get('$controller');
        this.$q = $injector.get('$q');
        this.$scope = $injector.get('$rootScope').$new();
        this.$state = $injector.get('$state');
        this.sandbox = sinon.sandbox.create();
        this.ControllerPromiseHandler = $injector.get(app.namespace.common+'.ControllerPromiseHandler');
        this.Customer = $injector.get(app.namespace.customer+'.Customer');
        this.CustomerInformationChecker = $injector.get(app.namespace.customer+'.CustomerInformationChecker');
        this.CustomerStorage = $injector.get(app.namespace.customer+'.CustomerStorage');
        this.GroupOrder = $injector.get(app.name+'.GroupOrder');
        this.Network = $injector.get(app.namespace.common+'.Network');
        this.Order = $injector.get(app.name+'.Order');
        this.controller = this.$controller(app.name + '.' + controllername + ' as vm', {
          '$scope': this.$scope,
          '$state': this.$state,
          'ControllerPromiseHandler': this.ControllerPromiseHandler,
          'Customer': this.Customer,
          'CustomerInformationChecker': this.CustomerInformationChecker,
          'CustomerStorage': this.CustomerStorage,
          'GroupOrder': this.GroupOrder,
          'Network': this.Network,
          'Order': this.Order
        });
        this.positionMock = {
          latitude: 48,
          longitude: 2
        };
        $injector.get('$httpBackend').whenGET(/^translations\/.*/).respond('{}');
      }));

      afterEach(function() {
        this.sandbox.restore();
      });

      it('should be defined', function() {
        expect(this.controller).to.be.defined;
      });

      it('should initially have no group orders loaded', function() {
        this.$scope.groupOrders.should.be.empty;
      });

      describe('Reloading', function() {
        beforeEach(function() {
          this.$scope.initialState = 'initial';
        });

        it('should check connectivity', function() {
          this.sandbox.stub(this.Network, 'hasConnectivity').returns(this.$q.defer().promise);
          this.$scope.onReload();
          this.Network.hasConnectivity.should.have.been.called
        });

        it('should call ControllerPromiseHandler.handle with a promise rejected with noNetwork if there is no network', function() {
          var errorKey = 'noNetwork';
          var expectedPromise = this.$q.reject(errorKey);
          this.sandbox.stub(this.Network, 'hasConnectivity').returns(this.$q.reject(errorKey));
          this.sandbox.spy(this.ControllerPromiseHandler, 'handle');
          this.$scope.onReload();
          this.$scope.$digest();
          this.ControllerPromiseHandler.handle.should.have.been.calledWithMatch(expectedPromise, 'initial');
        });

        it('should check get the group orders around the customer\'s position', function() {
          this.sandbox.stub(this.Network, 'hasConnectivity').returns(this.$q.when({}));
          this.sandbox.stub(this.CustomerStorage, 'getAddress').returns(this.positionMock);
          this.sandbox.stub(this.GroupOrder, 'get').returns(this.$q.defer().promise);
          this.$scope.onReload();
          this.$scope.$digest();
          this.GroupOrder.get.should.have.been.calledWithExactly(this.positionMock.latitude, this.positionMock.longitude);
        });

        it('should call ControllerPromiseHandler.handle with a rejected promise if it could not load group orders', function() {
          var expectedPromise = this.$q.reject();
          this.sandbox.stub(this.Network, 'hasConnectivity').returns(this.$q.when({}));
          this.sandbox.stub(this.CustomerStorage, 'getAddress').returns(this.positionMock);
          this.sandbox.stub(this.GroupOrder, 'get').returns(this.$q.reject());
          this.sandbox.spy(this.ControllerPromiseHandler, 'handle');
          this.$scope.onReload();
          this.$scope.$digest();
          this.ControllerPromiseHandler.handle.should.have.been.calledWithMatch(expectedPromise, 'initial');
        });

        it('should call ControllerPromiseHandler.handle with a promise rejected with noGroupOrders if it loaded no group orders', function() {
          var expectedPromise = this.$q.reject('noGroupOrders');
          this.sandbox.stub(this.Network, 'hasConnectivity').returns(this.$q.when({}));
          this.sandbox.stub(this.CustomerStorage, 'getAddress').returns(this.positionMock);
          this.sandbox.stub(this.GroupOrder, 'get').returns(this.$q.when([]));
          this.sandbox.spy(this.ControllerPromiseHandler, 'handle');
          this.$scope.onReload();
          this.$scope.$digest();
          this.ControllerPromiseHandler.handle.should.have.been.calledWithMatch(expectedPromise, 'initial');
        });

        it('should get in the scope the groupOrders if there are more than one of them', function() {
          var expectedGroupOrders = ['first', 'second']
          this.sandbox.stub(this.Network, 'hasConnectivity').returns(this.$q.when({}))
          this.sandbox.stub(this.CustomerStorage, 'getAddress').returns(this.positionMock);
          this.sandbox.stub(this.GroupOrder, 'get').returns(this.$q.when(expectedGroupOrders));
          this.$scope.onReload();
          this.$scope.$digest();
          this.$scope.groupOrders.should.deep.equal(expectedGroupOrders);
        });

        it('should call ControllerPromiseHandler.handle with a resolved promise if it loaded some group orders', function() {
          var expectedPromise = this.$q.when();
          this.sandbox.stub(this.Network, 'hasConnectivity').returns(this.$q.when({}));
          this.sandbox.stub(this.CustomerStorage, 'getAddress').returns(this.positionMock);
          this.sandbox.stub(this.GroupOrder, 'get').returns(this.$q.when(['groupOrder']));
          this.sandbox.spy(this.ControllerPromiseHandler, 'handle');
          this.$scope.onReload();
          this.$scope.$digest();
          this.ControllerPromiseHandler.handle.should.have.been.calledWithMatch(expectedPromise, 'initial');
        });
      });

      describe('On joining an order', function() {

        it('should check for missing information', function() {
          this.sandbox.stub(this.CustomerInformationChecker, 'check').returns(this.$q.defer().promise);
          this.$scope.onJoinOrderTouch();
          this.$scope.$digest();
          this.CustomerInformationChecker.check.should.have.been.called;
        });

        it('should set the current order and redirect to the restaurant menu is the customer is activated and has given all information', function() {
          var expectedGroupOrder = {
            restaurant: {
              data: {
                id: 42
              }
            }
          }
          this.sandbox.stub(this.CustomerInformationChecker, 'check').returns(this.$q.when({}));
          this.sandbox.spy(this.Order, 'setCurrentOrder');
          this.sandbox.stub(this.$state, 'go');
          this.$scope.onJoinOrderTouch(expectedGroupOrder);
          this.$scope.$digest();
          this.Order.setCurrentOrder.should.have.been.called;
          this.$state.go.should.have.been.calledWithExactly('app.restaurant-menu', {
            restaurantId: expectedGroupOrder.restaurant.data.id
          });
        });

      });

      describe('Setting array from int', function() {
        it('should return an Array filled whose length is the given parameter', function() {
          var input = 6;
          this.$scope.setArrayFromInt(input).length.should.equal(input)
        });

        it('should include only undefined values', function() {
          var input = 2;
          var output = this.$scope.setArrayFromInt(input);
          expect(output[0]).to.be.undefined;
          expect(output[1]).to.be.undefined;
        });
      });

      describe('After entering the view', function() {
        it('should reload the group orders when entering the view', function() {
          this.sandbox.stub(this.$scope, 'onReload');
          this.$scope.$broadcast('$ionicView.afterEnter');
          this.$scope.onReload.should.have.been.called;
        });
      });

    });
  });
});
