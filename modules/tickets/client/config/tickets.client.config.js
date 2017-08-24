(function () {
  'use strict';

  angular.module('tickets', ['moment-picker', 'ngFileUpload'])
    .config(function($locationProvider) {
      $locationProvider.html5Mode(true);
    })
    .filter('dateFilter', function() {
      return function(values, dateObj) {

        // gets records within two days of the specified date
        if (typeof values != 'undefined' && typeof dateObj != 'undefined' && dateObj.hasOwnProperty('date') && typeof dateObj.date != 'undefined') {

          var filtered = [];
          try {
            angular.forEach(values, function(value) {
              if (Math.abs(dateObj.date.diff(value.date, 'days')) < 3)
                filtered.push(value);
            });
          } catch (e) {
            console.log('YO', e);
          }

          return filtered;
        } else {
          return values;
        }
      };
    })
    .filter('matchDate', function() {
      return function(values, dateStr) {

        // gets records created on the specified date
        var filtered = [];

        if (typeof values != 'undefined' && typeof dateStr != 'undefined') {
          var todayDate = dateStr.createdAt.substring(0, 10);
          try {
            angular.forEach(values, function(value) {
              if (value.createdAt.substring(0, 10) === todayDate)
                filtered.push(value);
            });
          } catch (e) {
            console.log('YO', e);
          }
        }

        return filtered;
      };
    })
    .filter('excludeDate', function() {
      return function(values, dateStr) {

        // gets records not created on the specified date
        var filtered = [];

        if (typeof values != 'undefined' && typeof dateStr != 'undefined') {
          var todayDate = dateStr.createdAt.substring(0, 10);
          try {
            angular.forEach(values, function(value) {
              if (!(value.createdAt.substring(0, 10) === todayDate))
                filtered.push(value);
            });
          } catch (e) {
            console.log('YO', e);
          }
        }

        return filtered;
      };
    })
    .filter('sumOfValue', function () {
      return function (data, key) {
        if (angular.isUndefined(data) || angular.isUndefined(key))
          return 0;
        var sum = 0;
        angular.forEach(data, function(value) {
          sum = sum + value[key];
        });
        return sum;
      };
    });
}());
