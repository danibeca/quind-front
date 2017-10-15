(function () {
    'use strict';

    angular
        .module('blocks.translate')
        .run(translateRun);

    /* @ngInject */
    function translateRun($rootScope, $translate, $state, $cookies, $translatePartialLoader, storageService) {
        $rootScope.changeLanguage = function (langKey) {
            storageService.set('lang', langKey);
            $translate.use(langKey).then(function () {
                $translatePartialLoader.addPart('general');
                $state.go($state.current, {}, {reload: true});
                $rootScope.$on('$stateChangeSuccess', function () {
                    $translate.refresh();
                });
            });

        };

        var defaultLanguage = 'es';
        if ($cookies.get('NG_TRANSLATE_LANG_KEY')) {
            defaultLanguage = $cookies.get('NG_TRANSLATE_LANG_KEY').replace(/^"|"$/g, '');
        }
        storageService.set('lang', defaultLanguage);

    }
})();
