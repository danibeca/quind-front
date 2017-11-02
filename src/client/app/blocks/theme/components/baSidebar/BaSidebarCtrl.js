/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .controller('BaSidebarCtrl', BaSidebarCtrl);

    /* @ngInject */
    function BaSidebarCtrl($scope, baSidebarService, storageService, componentService) {

        var croot = storageService.getJsonObject('croot');
        $scope.menuItems = baSidebarService.getMenuItems();
        $scope.defaultSidebarState = $scope.menuItems[0].stateRef;
        $scope.hasLeaves = false;

        $scope.hoverItem = function ($event) {
            $scope.showHoverElem = true;
            $scope.hoverElemHeight = $event.currentTarget.clientHeight;
            var menuTopValue = 66;
            $scope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
        };

        $scope.$on('$stateChangeSuccess', function () {
            if (baSidebarService.canSidebarBeHidden()) {
                baSidebarService.setMenuCollapsed(true);
            }
        });

        activate();

        function activate() {
            showMenu();
        }

        function showMenu() {
            componentService.hasLeaves(croot.id)
                .then(successHasLeaves);
            function successHasLeaves(hasLeaves) {
                $scope.hasLeaves = hasLeaves;
            }
        }
    }
})();
