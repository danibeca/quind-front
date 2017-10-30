(function () {
    'use strict';

    angular
        .module('blocks.rest')
        .factory('cilogAPI', cilogAPI);

    /* @ngInject */
    function cilogAPI(Restangular, environmentConfig) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(environmentConfig.cilogAPI);
        });
    }
}());
