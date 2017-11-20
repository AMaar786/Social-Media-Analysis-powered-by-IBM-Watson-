'use strict';

/* Filters */
var Filters = angular.module('wvajs.filters', []);

Filters.filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});


Filters.filter('i18n', ['i18nService',
    function(i18nService) {
        return function(i18Key) {
            return i18nService.getProperty(i18Key);
        }
    }
]);
