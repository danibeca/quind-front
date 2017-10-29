/**
 * @author jmruiz6
 * created on 10.28.2017
 */
/* jshint -W101,-W106, -W117 */
// jscs:disable
(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .directive('componentDashboard', componentDashboard);

    /* @ngInject */
    function componentDashboard() {
        return {
            restrict: 'E',
            controller: 'ComponentDashboardCtrl',
            controllerAs: 'vm',
            templateUrl: 'app/blocks/theme/components/componentDashboard/componentDashboard.html',
            scope: {
                component: '@',
                goBackFunction: '&'
            },
            link: function(scope, element, attrs, controller) {
                scope.$watch('component', function () {
                    if (scope.component !== undefined && scope.component !== null) {
                        controller.setComponent(JSON.parse(scope.component));
                    }
                });
            }
        };
    }

})();
