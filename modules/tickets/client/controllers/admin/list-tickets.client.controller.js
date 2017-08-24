(function () {
  'use strict';

  angular
    .module('tickets.admin')
    .controller('TicketsAdminListController', TicketsAdminListController);

  TicketsAdminListController.$inject = ['TicketsService'];

  function TicketsAdminListController(TicketsService) {
    var vm = this;

    vm.tickets = TicketsService.query();
  }
}());
