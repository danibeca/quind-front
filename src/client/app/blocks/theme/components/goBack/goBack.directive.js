/**
 * @author jmruiz6
 * created on 10.28.2017
 */
/* jshint -W101,-W106, -W117 */
// jscs:disable
(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .directive('goBack', goBack);

    /* @ngInject */
    function goBack() {
        return {
            restrict: 'E',
            templateUrl: 'app/blocks/theme/components/goBack/goBack.html',
            scope: {
                goBackFunction: '&'
            }
        };
    }
})();
