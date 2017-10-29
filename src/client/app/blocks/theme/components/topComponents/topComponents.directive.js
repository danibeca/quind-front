/**
 * @author jmruiz6
 * created on 10.28.2017
 */
/* jshint -W101,-W106, -W117 */
// jscs:disable
(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .directive('topComponents', topComponents);

    /* @ngInject */
    function topComponents() {
        return {
            restrict: 'E',
            controller: 'TopComponentsCtrl',
            controllerAs: 'vm',
            templateUrl: 'app/blocks/theme/components/topComponents/topComponents.html',
            scope: {
                components: '@',
                indicators: '@',
                numberOfItems: '@'
            },
            link: function(scope, element, attrs, controller) {
                scope.$watch('components', function () {
                    if (scope.components !== undefined && scope.components !== '') {
                        controller.setComponents(JSON.parse(scope.components));
                    }
                });

                scope.$watch('indicators', function () {
                    if (scope.indicators !== undefined && scope.indicators !== '') {
                        controller.setIndicators(JSON.parse(scope.indicators));
                    }
                });

                scope.$watch('numberOfItems', function () {
                    if (scope.numberOfItems !== undefined && scope.numberOfItems !== '') {
                        controller.setNumberOfItems(scope.numberOfItems);
                    }
                });
            }
        };
    }

})();
