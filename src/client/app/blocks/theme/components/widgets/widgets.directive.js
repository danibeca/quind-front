/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .directive('widgets', widgets);

    /* @ngInject */
    function widgets() {
        return {
            restrict: 'EA',
            scope: {
                ngModel: '='
            },
            templateUrl: 'app/blocks/theme/components/widgets/widgets.html',
            replace: true
        };
    }

})();
