(function () {
  'use strict';

  angular
    .module('tickets.admin')
    .controller('TicketsAdminController', TicketsAdminController);

  TicketsAdminController.$inject = ['$scope', '$state', '$window', 'ticketResolve', 'Authentication', 'Notification'];

  function TicketsAdminController($scope, $state, $window, ticket, Authentication, Notification) {
    var vm = this;

    vm.ticket = ticket;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Ticket
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.ticket.$remove(function() {
          $state.go('admin.tickets.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Ticket deleted successfully!' });
        });
      }
    }

    // Save Ticket
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.ticketForm');
        return false;
      }

      // Create a new ticket, or update the current instance
      vm.ticket.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.tickets.list'); // should we send the User to the list or the updated Ticket's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Ticket saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Ticket save error!' });
      }
    }
  }
}());
