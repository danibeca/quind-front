 (function() {
    'use strict';

    angular
        .module('blocks.rest')
        .factory('qalogAPI', qalogAPI);

    /* @ngInject */
    function qalogAPI(Restangular,environmentConfig) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(environmentConfig.qalogAPI);
        });
    }
}());
