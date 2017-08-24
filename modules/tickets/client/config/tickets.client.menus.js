(function () {
  'use strict';

  angular
    .module('tickets')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Tickets',
      state: 'tickets',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'tickets', {
      title: 'List Tickets',
      state: 'tickets.list',
      roles: ['*']
    });
  }
}());
