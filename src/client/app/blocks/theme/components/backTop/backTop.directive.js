/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
/* jshint -W117 */
(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .directive('backTop', backTop);

    /* @ngInject */
    function backTop() {
        return {
            restrict: 'E',
            templateUrl: 'app/blocks/theme/components/backTop/backTop.html',
            controller: function () {
                $('#backTop').backTop({
                    'position': 200,
                    'speed': 100
                });
            }
        };
    }

})();
