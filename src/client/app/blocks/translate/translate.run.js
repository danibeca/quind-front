(function () {
    'use strict';

    angular
        .module('blocks.translate')
        .run(translateRun);

    /* @ngInject */
    function translateRun($rootScope, $translate, storage, $state, $cookies) {
        $rootScope.changeLanguage = function (langKey) {
            storage.set('lang', langKey);
            $translate.use(langKey);
            $state.go($state.current, {}, {reload: true});
            $rootScope.$on('$stateChangeSuccess', function () {
                $translate.refresh();
            });
        };

        var defaultLanguage = 'es';
        if ($cookies.get('NG_TRANSLATE_LANG_KEY')) {
            defaultLanguage = $cookies.get('NG_TRANSLATE_LANG_KEY').replace(/^"|"$/g, '');
        }
        storage.set('lang', defaultLanguage);

    }
})();
