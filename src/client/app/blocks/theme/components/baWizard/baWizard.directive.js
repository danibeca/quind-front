(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .directive('baWizard', baWizard);

    /* @ngInject */
    function baWizard() {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'app/blocks/theme/components/baWizard/baWizard.html',
            controllerAs: '$baWizardController',
            controller: 'baWizardCtrl'
        };
    }
})();
