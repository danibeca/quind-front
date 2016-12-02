(function () {
    'use strict';

    angular.module('blocks.translate')
        .config(translateConfig);

    /* @ngInject */
    function translateConfig($translateProvider) {
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'app/i18n/{part}/{lang}.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('sanitize');
        $translateProvider.useCookieStorage();
    }
})();
