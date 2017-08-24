(function () {
  'use strict';

  // Configuring the Tickets Admin module
  angular
    .module('tickets.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Tickets',
      state: 'admin.tickets.list'
    });
  }
}());
