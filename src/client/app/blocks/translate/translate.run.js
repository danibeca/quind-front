(function() {
    'use strict';

    angular
        .module('blocks.translate')
        .run(translateRun);

    /* @ngInject */
    function translateRun($rootScope, $translate) {
        $rootScope.changeLanguage = function (langKey) {
            $translate.use(langKey);
        };
    }
})();
