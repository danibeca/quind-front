/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .directive('msgCenter', msgCenter);

    /* @ngInject */
    function msgCenter() {
        return {
            restrict: 'E',
            templateUrl: 'app/blocks/theme/components/msgCenter/msgCenter.html',
            controller: 'MsgCenterCtrl'
        };
    }

})();
