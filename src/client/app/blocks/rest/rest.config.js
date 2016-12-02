(function () {
    'use strict';

    angular.module('blocks.rest')
        .config(restConfig);

    /* @ngInject */
    function restConfig(RestangularProvider, environmentConfig) {
        RestangularProvider.setBaseUrl(environmentConfig.api);
        RestangularProvider.addResponseInterceptor(function (data, operation) {
            var extractedData;
            if (operation === 'getList') {
                extractedData = data.data;
            } else {
                extractedData = data;
            }
            return extractedData;
        });
    }
})();
