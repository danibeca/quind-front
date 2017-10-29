/**
 * @author jmruiz6
 * created on 10.28.2017
 */
/* jshint -W101,-W106, -W117 */
// jscs:disable
(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .directive('componentsTable', componentsTable);

    /* @ngInject */
    function componentsTable() {
        return {
            restrict: 'E',
            controller: 'ComponentsTableCtrl',
            controllerAs: 'vm',
            templateUrl: 'app/blocks/theme/components/componentsTable/componentsTable.html',
            scope: {
                components: '@',
                crootId: '@',
                showTypes: '@',
                showCodes: '@',
                showCodeHealth: '@',
                showReliability: '@',
                showEfficiencyPotential: '@',
                allowAdd: '@',
                allowEdit: '@',
                allowDelete: '@',
                allowViewMore: '@',
                addComponentFunction: '&',
                editComponentFunction: '&',
                deleteComponentFunction: '&',
                viewMoreFunction: '&'
            },
            link: function(scope, element, attrs, controller) {
                scope.$watch('components', function () {
                    if (scope.components !== undefined && scope.components !== '') {
                        controller.setComponents(JSON.parse(scope.components));
                    }
                });

                scope.$watch('crootId', function () {
                    if (scope.crootId !== undefined && scope.crootId !== '') {
                        controller.setCrootId(scope.crootId);
                    }
                });

                scope.$watch('showTypes', function () {
                    if (scope.showTypes !== undefined && scope.showTypes !== '') {
                        controller.setShowTypes(scope.showTypes);
                    }
                });

                scope.$watch('showCodes', function () {
                    if (scope.showCodes !== undefined && scope.showCodes !== '') {
                        controller.setShowCodes(scope.showCodes);
                    }
                });

                scope.$watch('showCodeHealth', function () {
                    if (scope.showCodeHealth !== undefined && scope.showCodeHealth !== '') {
                        controller.setShowCodeHealth(scope.showCodeHealth);
                    }
                });
                scope.$watch('showReliability', function () {
                    if (scope.showReliability !== undefined && scope.showReliability !== '') {
                        controller.setShowReliability(scope.showReliability);
                    }
                });
                scope.$watch('showEfficiencyPotential', function () {
                    if (scope.showEfficiencyPotential !== undefined && scope.showEfficiencyPotential !== '') {
                        controller.setShowEfficiencyPotential(scope.showEfficiencyPotential);
                    }
                });

                scope.$watch('allowAdd', function () {
                    if (scope.allowAdd !== undefined && scope.allowAdd !== '') {
                        controller.setAllowAdd(scope.allowAdd);
                    }
                });

                scope.$watch('allowEdit', function () {
                    if (scope.allowEdit !== undefined && scope.allowEdit !== '') {
                        controller.setAllowEdit(scope.allowEdit);
                    }
                });

                scope.$watch('allowDelete', function () {
                    if (scope.allowDelete !== undefined && scope.allowDelete !== '') {
                        controller.setAllowDelete(scope.allowDelete);
                    }
                });

                scope.$watch('allowViewMore', function () {
                    if (scope.allowViewMore !== undefined && scope.allowViewMore !== '') {
                        controller.setAllowViewMore(scope.allowViewMore);
                    }
                });
            }
        };
    }

})();
