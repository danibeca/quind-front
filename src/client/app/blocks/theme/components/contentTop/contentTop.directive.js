/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .directive('contentTop', contentTop);

    /* @ngInject */
    function contentTop($location, $state, $filter) {
        return {
            restrict: 'E',
            templateUrl: 'app/blocks/theme/components/contentTop/contentTop.html',
            scope: {
                alternativeTile: '@',
                showAlternativeTitle: '@'
            },
            link: function ($scope) {
                $scope.$watch(function () {
                    $scope.activePageTitle = $filter('translate')($state.current.title);
                });
            }
        };
    }

})();
