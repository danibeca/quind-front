(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('requestInterceptor', requestInterceptor)
        .config(config);

    /* @ngInject */
    function requestInterceptor($q, $window, $injector, storage) {
        var service = {
            request: request,
            responseError: responseError
        };

        return service;

        function request(config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }

            if (storage.get('lang')) {
                config.headers.Language = storage.get('lang');
            }
            return config;
        }

        function responseError(rejection) {
            console.log(rejection);
            var msg = null;
            if (rejection.data.error) {
                msg = rejection.data.error.message;
            } else {
                msg = JSON.parse(rejection.data).message;
            }
            msg = msg + ': ' + rejection.config.url;
            //toastr.error(msg);
            if (rejection.status === 401) {
                $injector.get('$state').transitionTo('login');
            }
            return $q.reject(rejection);
        }
    }

    /* @ngInject */
    function config($httpProvider) {
        $httpProvider.interceptors.push('requestInterceptor');
    }
})();
