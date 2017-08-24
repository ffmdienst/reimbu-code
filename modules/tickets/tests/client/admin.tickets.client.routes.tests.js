(function () {
  'use strict';

  describe('Tickets Route Tests', function () {
    // Initialize global variables
    var $scope,
      TicketsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TicketsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TicketsService = _TicketsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.tickets');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/tickets');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('admin.tickets.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/tickets/client/views/admin/list-tickets.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TicketsAdminController,
          mockTicket;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.tickets.create');
          $templateCache.put('/modules/tickets/client/views/admin/form-ticket.client.view.html', '');

          // Create mock ticket
          mockTicket = new TicketsService();

          // Initialize Controller
          TicketsAdminController = $controller('TicketsAdminController as vm', {
            $scope: $scope,
            ticketResolve: mockTicket
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.ticketResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/tickets/create');
        }));

        it('should attach an ticket to the controller scope', function () {
          expect($scope.vm.ticket._id).toBe(mockTicket._id);
          expect($scope.vm.ticket._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/tickets/client/views/admin/form-ticket.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TicketsAdminController,
          mockTicket;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.tickets.edit');
          $templateCache.put('/modules/tickets/client/views/admin/form-ticket.client.view.html', '');

          // Create mock ticket
          mockTicket = new TicketsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Ticket about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TicketsAdminController = $controller('TicketsAdminController as vm', {
            $scope: $scope,
            ticketResolve: mockTicket
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:ticketId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.ticketResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            ticketId: 1
          })).toEqual('/admin/tickets/1/edit');
        }));

        it('should attach an ticket to the controller scope', function () {
          expect($scope.vm.ticket._id).toBe(mockTicket._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/tickets/client/views/admin/form-ticket.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
