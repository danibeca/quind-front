/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .directive('popularApp', popularApp);

    /* @ngInject */
    function popularApp() {
        return {
            restrict: 'E',
            templateUrl: 'app/dashboard/directive/popularApp.html'
        };
    }
})();
