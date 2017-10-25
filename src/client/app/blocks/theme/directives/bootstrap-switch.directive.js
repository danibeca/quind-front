/**
 * @author JmRuiz6
 * created on 10.24.2017
 */
(function () {
    'use strict';

    angular.module('blocks.theme')
        .directive('bootstrapSwitch', bootstrapSwitch);

    /* @ngInject */
    function bootstrapSwitch($timeout, spinnerService) {
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                positivetext: '@',
                offtext: '@',
                first: '@',
                model: '=ngModel'
            },
            link: function(scope, element, attrs, ngModel) {
                scope.$watch('positivetext', function () {
                    if (scope.positivetext !== undefined && scope.positivetext !== '') {
                        if (isReady()) {
                            createSwitch();
                        }
                    }
                });

                scope.$watch('offtext', function () {
                    if (scope.offtext !== undefined && scope.offtext !== '') {
                        if (isReady()) {
                            createSwitch();
                        }
                    }
                });

                scope.$watch('model', function(newValue, oldValue) {
                    if (newValue) {
                        element.bootstrapSwitch('state', true, true);
                    } else {
                        element.bootstrapSwitch('state', false, true);
                    }
                });

                function isReady() {
                    var result = false;
                    if (scope.positivetext !== undefined && scope.positivetext !== '' &&
                        scope.offtext !== undefined && scope.offtext !== ''
                    ) {
                        result = true;
                    }
                    return result;
                }

                function createSwitch() {
                    var delay = 0;
                    $timeout(function () {
                        element.bootstrapSwitch();
                        element.bootstrapSwitch('onText', scope.positivetext);
                        element.bootstrapSwitch('offText', scope.offtext);

                        element.on('switchChange.bootstrapSwitch', function(event, state) {
                            if (ngModel) {
                                scope.$apply(function() {
                                    ngModel.$setViewValue(state);
                                });
                            }
                        });
                    }, delay);
                }
            }
        };
    }
})();
