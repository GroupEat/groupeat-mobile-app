'use strict';
var controllername = 'OrdersCtrl';

module.exports = function(app) {
  var fullname = app.name + '.' + controllername;
  /*jshint validthis: true */

  var deps = [
    app.namespace.common + '.Lodash',
    '$q',
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    app.namespace.common + '.ControllerPromiseHandler',
    app.namespace.authentication + '.Credentials',
    app.namespace.common + '.Network',
    app.name + '.Order'
  ];

  function controller(_, $q, $rootScope, $scope, $state, $stateParams, ControllerPromiseHandler, Credentials, Network, Order) {
    $scope.onReload = function () {
      var promise = Network.hasConnectivity()
      .then(function() {
        return Order.queryForCustomer(Credentials.get().id);
      })
      .then(function(orders) {
        if (_.isEmpty(orders)) {
          return $q.reject('noOrders');
        } else {
          $scope.orders = orders;
        }
      });
      ControllerPromiseHandler.handle(promise, $scope.initialState)
      .finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.getTimeDiff = function (endingAt) {
      return Order.getTimeDiff(endingAt);
    };

    $scope.$on('$ionicView.afterEnter', function() {
      $scope.initialState = $state.current.name;
      $scope.onReload();
    });
  }

  controller.$inject = deps;
  app.controller(fullname, controller);
};
