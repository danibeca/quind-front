/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .directive('pageTop', pageTop);

    /* @ngInject */
    function pageTop() {
        return {
            restrict: 'E',
            controller: 'PageTopCtrl',
            controllerAs: 'vm',
            templateUrl: 'app/blocks/theme/components/pageTop/pageTop.html',
            scope: true,
            link: function($scope, element, attrs, controller) {

            }
        };
    }

})();
