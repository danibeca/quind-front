(function () {
    'use strict';

    angular.module('blocks.translate')
        .config(translateConfig);

    /* @ngInject */
    function translateConfig($translateProvider) {
        var defaultLanguage = 'es';

        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'app/i18n/{part}/{lang}.json'
        });
        $translateProvider.preferredLanguage(defaultLanguage);
        $translateProvider.useSanitizeValueStrategy('sanitize');
        $translateProvider.useCookieStorage();
    }
})();
