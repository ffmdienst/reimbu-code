(function () {
  'use strict';

  angular
    // .module('tickets', ['ngFileUpload'])
    .module('tickets')
    .controller('TicketsListController', TicketsListController);

  TicketsListController.$inject = ['$scope', '$http', '$location', 'TicketsService', 'Upload'];

  function TicketsListController($scope, $http, $location, TicketsService, Upload) {
    $scope.formData = {};
    $scope.picFile = null;
    $scope.today = (new Date()).toISOString();
    $scope.file = null;
    $scope.modalUrl = '';
    $scope.token = '';
    $scope.progress = 0;
    // $scope.base64 = null;
    // $scope.thumb64 = null;

    // GET =====================================================================
    // when landing on the page, get all tickets and show them
    // use the service to get all the tickets
    TicketsService.get()
      .success(function(data) {
        $scope.tickets = data.tickets;
        $scope.token = data.token;
      });

    $scope.pictureUI = function() {
      angular.element('#pickPic').trigger('click');
    };

    $scope.updateModal = function(url) {
      $scope.modalUrl = url;
    };

    $scope.cacheImage = function(file) {
      if (file) {

        var rightnow = (new Date()).toISOString();
        // $scope.progress = 0;

        $scope.f = {
          // token: $location.search().token,
          api: 'https://api.github.com/repos/ffmdienst/reimbu/contents/',
          path: rightnow.substring(0, 10) + '/' + rightnow.substring(10),
          extension: (file.type === 'image/png') ? '.png' : '.jpg'
        };

        Upload.base64DataUrl(file).then(function (url) {

          $http({
            method: 'PUT',
            url: $scope.f.api + $scope.f.path + $scope.f.extension,
            headers: {
              'Authorization': 'token ' + $scope.token
            },
            data: JSON.stringify({
              'path': $scope.f.path + $scope.f.extension,
              'message': '.',
              'content': url.split(',')[1]
            })
          }).then(function (success) {
            $scope.formData.imageUrl = success.data.content.download_url;
            $scope.progress++;
            // callback(success);
          }, function (error) {
            errorCallback(error);
          });
        });
        Upload.resize(file, { width: 100, height: 100 }).then(function (blob) {
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function() {

            $http({
              method: 'PUT',
              url: $scope.f.api + $scope.f.path + '.thumb' + $scope.f.extension,
              headers: {
                'Authorization': 'token ' + $scope.token
              },
              data: JSON.stringify({
                'path': $scope.f.path + '.thumb' + $scope.f.extension,
                'message': '.',
                'content': reader.result.split(',')[1]
              })
            }).then(function (success) {
              $scope.formData.thumbUrl = success.data.content.download_url;
              $scope.progress++;
              // callback(success);
            }, function (error) {
              errorCallback(error);
            });
          };
        });
      }
    };

    // CREATE ==================================================================
    // when submitting the add form, send the text to the node API
    $scope.createTicket = function() {

      // validate the formData to make sure that something is there
      // if form is empty, nothing will happen
      // people can't just hold enter to keep adding the same to-do anymore
      if (!$.isEmptyObject($scope.formData)) {

        $scope.formData.date = $scope.formData.date.toISOString(); // Convert Moment date to UTC string

        // call the create function from our service (returns a promise object)
        TicketsService.create($scope.formData)

          // if successful creation, call our get function to get all the new tickets
          .success(function(data) {
            // $scope.formData = {}; // clear the form so our user is ready to enter another
            delete $scope.formData.price;
            delete $scope.formData.reimbursed;
            delete $scope.formData.date;
            delete $scope.formData.imageUrl;
            delete $scope.formData.thumbUrl;
            $scope.progress = 0;
            $scope.picFile = null;
            $scope.tickets = data; // assign our new list of tickets
          });
      }
    };

    // DELETE ==================================================================
    // delete a ticket after checking it
    $scope.deleteTicket = function(id) {
      TicketsService.delete(id)
        // if successful creation, call our get function to get all the new tickets
        .success(function(data) {
          $scope.tickets = data; // assign our new list of tickets
        });
    };
  }
}());
