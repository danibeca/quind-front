(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('requestInterceptor', requestInterceptor)
        .config(config);

    /* @ngInject */
    function requestInterceptor($q, $injector, storage, environmentConfig, toastr, user) {
        var service = {
            request: request,
            responseError: responseError
        };

        return service;

        function request(config) {
            config.headers = config.headers || {};
            var token = storage.get('token');
            if (token) {
                config.headers.Authorization = 'Bearer ' + token;
            }
            if (storage.get('lang')) {
                config.headers.Language = storage.get('lang');
            }
            return config;
        }

        function responseError(rejection) {
            var msg = getErrorMessage(rejection);

            if (environmentConfig.env === 'dev') {
                console.log(rejection);
                toastr.error(rejection.config.url + ': ' + msg);
            }
            if (rejection.data.error.statusCode === 400) {
                if (msg.includes('Token')) {
                    securityRedirect();
                }
            }
            if (rejection.data.error.statusCode === 401) {
                if (msg.includes('not be verified')) {
                    var deferred = $q.defer();
                    retryHttpRequest(rejection.config, deferred);
                    return deferred.promise;
                } else {
                    securityRedirect();
                }
            }

            return $q.reject(rejection);
        }

        function securityRedirect() {
            user.logout();
            $injector.get('$state').go('login');
        }


        function retryHttpRequest(config, deferred) {
            function successCallback(response) {
                deferred.resolve(response);
            }

            function errorCallback(response) {
                deferred.reject(response);
            }

            var $http = $injector.get('$http');
            $http(config).then(successCallback, errorCallback);
        }

        function getErrorMessage(rejection) {
            var result = null;
            if (rejection.data.error) {
                result = rejection.data.error.message;
            } else {
                result = JSON.parse(rejection.data).message;
            }
            return result;
        }
    }

    /* @ngInject */
    function config($httpProvider) {
        $httpProvider.interceptors.push('requestInterceptor');
    }
})();
