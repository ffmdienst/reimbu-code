(function () {
  'use strict';

  angular
    .module('tickets')
    .controller('TicketsController', TicketsController);

  TicketsController.$inject = ['$scope', 'ticketResolve', 'Authentication'];

  function TicketsController($scope, ticket, Authentication) {
    var vm = this;

    vm.ticket = ticket;
    vm.authentication = Authentication;

  }
}());
