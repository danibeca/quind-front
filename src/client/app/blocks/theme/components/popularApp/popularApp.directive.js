/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .directive('popularApp', popularApp);

    /* @ngInject */
    function popularApp($timeout) {
        return {
            restrict: 'E',
            controllerAs:'vm',
            controller: 'PopularAppCtrl',
            scope: {
                vars: '@'
            },
            templateUrl: 'app/blocks/theme/components/popularApp/popularApp.html',
            link: function (scope, element, attrs, controller) {
                scope.$watch('vars', function () {
                    if (scope.vars !== undefined && scope.vars !== '') {
                        var details = JSON.parse(scope.vars);
                        var delay = 10;
                        $timeout(function () {
                            controller.setDetails(details);
                        }, delay);
                    }

                });
            }

        };
    }
})();
