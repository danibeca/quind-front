(function () {
    'use strict';

    angular
        .module('blocks.rest')
        .factory('qastaAPI', qastaAPI);

    /* @ngInject */
    function qastaAPI(Restangular, environmentConfig) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(environmentConfig.qastaAPI);
        });
    }
}());
