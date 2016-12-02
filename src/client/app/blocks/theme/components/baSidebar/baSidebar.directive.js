/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
/* jshint -W101, -W117 */
/* jscs:disable */
(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .directive('baSidebar', baSidebar);

    /* @ngInject */
    function baSidebar($timeout, baSidebarService, baUtil) {
        var jqWindow = $(window);
        return {
            restrict: 'E',
            templateUrl: 'app/blocks/theme/components/baSidebar/ba-sidebar.html',
            controller: 'BaSidebarCtrl',
            link: function (scope, el) {

                scope.menuHeight = el[0].childNodes[0].clientHeight - 84;
                jqWindow.on('click', _onWindowClick);
                jqWindow.on('resize', _onWindowResize);

                scope.$on('$destroy', function () {
                    jqWindow.off('click', _onWindowClick);
                    jqWindow.off('resize', _onWindowResize);
                });

                function _onWindowClick($evt) {
                    if (!baUtil.isDescendant(el[0], $evt.target) && !$evt.originalEvent.$sidebarEventProcessed && !baSidebarService.isMenuCollapsed() &&
                        baSidebarService.canSidebarBeHidden()) {
                        $evt.originalEvent.$sidebarEventProcessed = true;
                        $timeout(function () {
                            baSidebarService.setMenuCollapsed(true);
                        }, 10);
                    }
                }

                // watch window resize to change menu collapsed state if needed
                function _onWindowResize() {
                    var newMenuCollapsed = baSidebarService.shouldMenuBeCollapsed();
                    var newMenuHeight = _calculateMenuHeight();
                    if (newMenuCollapsed !== baSidebarService.isMenuCollapsed() || scope.menuHeight !== newMenuHeight) {
                        scope.$apply(function () {
                            scope.menuHeight = newMenuHeight;
                            baSidebarService.setMenuCollapsed(newMenuCollapsed);
                        });
                    }
                }

                function _calculateMenuHeight() {
                    return el[0].childNodes[0].clientHeight - 84;
                }
            }
        };
    }

})();