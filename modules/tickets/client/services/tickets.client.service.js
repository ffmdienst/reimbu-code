// Tickets service used to communicate Tickets REST endpoints
(function () {
  'use strict';

  angular
    .module('tickets')
    .factory('TicketsService', TicketsService);

  TicketsService.$inject = ['$http'];

  function TicketsService($http) {
    return {
      get: function() {
        return $http.get('/api/tickets');
      },
      create: function(ticketData) {
        return $http.post('/api/tickets', ticketData);
      },
      delete: function(id) {
        return $http.delete('/api/tickets/' + id);
      }
    };
  }
}());
