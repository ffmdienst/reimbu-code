(function () {
  'use strict';

  angular
    .module('tickets.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.tickets', {
        abstract: true,
        url: '/tickets',
        template: '<ui-view/>'
      })
      .state('admin.tickets.list', {
        url: '',
        templateUrl: '/modules/tickets/client/views/admin/list-tickets.client.view.html',
        controller: 'TicketsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['user']
        }
      })
      .state('admin.tickets.create', {
        url: '/create',
        templateUrl: '/modules/tickets/client/views/admin/form-ticket.client.view.html',
        controller: 'TicketsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          ticketResolve: newTicket
        }
      })
      .state('admin.tickets.edit', {
        url: '/:ticketId/edit',
        templateUrl: '/modules/tickets/client/views/admin/form-ticket.client.view.html',
        controller: 'TicketsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          ticketResolve: getTicket
        }
      });
  }

  getTicket.$inject = ['$stateParams', 'TicketsService'];

  function getTicket($stateParams, TicketsService) {
    return TicketsService.get({
      ticketId: $stateParams.ticketId
    }).$promise;
  }

  newTicket.$inject = ['TicketsService'];

  function newTicket(TicketsService) {
    return new TicketsService();
  }
}());
