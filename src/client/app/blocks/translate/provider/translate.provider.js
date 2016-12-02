(function () {
    'use strict';

    angular
        .module('blocks.translate')
        .provider('translateHelper', translateHelperProvider);

    function translateHelperProvider() {
        /* jshint validthis:true */
        this.$get = TranslateHelper;

        /* @ngInject */
        function TranslateHelper($translatePartialLoader, $translate) {

            var service = {
                addParts: addParts
            };

            return service;

            ///////////////

            function addParts() {
                angular.forEach(arguments, function (translationKey) {

                    $translatePartialLoader.addPart(translationKey);
                });
                return $translate.refresh();
            }
        }
    }
})();
