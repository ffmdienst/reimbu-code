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
          mainstate = $state.get('tickets');
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
          liststate = $state.get('tickets.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/tickets/client/views/list-tickets.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TicketsController,
          mockTicket;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('tickets.view');
          $templateCache.put('/modules/tickets/client/views/view-ticket.client.view.html', '');

          // create mock ticket
          mockTicket = new TicketsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Ticket about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TicketsController = $controller('TicketsController as vm', {
            $scope: $scope,
            ticketResolve: mockTicket
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:ticketId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.ticketResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            ticketId: 1
          })).toEqual('/tickets/1');
        }));

        it('should attach an ticket to the controller scope', function () {
          expect($scope.vm.ticket._id).toBe(mockTicket._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/tickets/client/views/view-ticket.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/tickets/client/views/list-tickets.client.view.html', '');

          $state.go('tickets.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('tickets/');
          $rootScope.$digest();

          expect($location.path()).toBe('/tickets');
          expect($state.current.templateUrl).toBe('/modules/tickets/client/views/list-tickets.client.view.html');
        }));
      });
    });
  });
}());
