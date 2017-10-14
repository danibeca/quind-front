 (function() {
    'use strict';

    angular
        .module('blocks.rest')
        .factory('accountAPI', accountAPI);

    /* @ngInject */
    function accountAPI(Restangular,environmentConfig) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(environmentConfig.accountAPI);
        });
    }
}());
