(function () {
    'use strict';

    angular
        .module('app.core', [
            'ngAnimate',
            'ngSanitize',
            'blocks.exception',
            'blocks.logger',
            'blocks.router',
            'blocks.storage',
            'blocks.translate',
            'blocks.rest',
            'blocks.constants',
            'blocks.theme',
            'ui.router', 'ngplus'
        ]);
})();
