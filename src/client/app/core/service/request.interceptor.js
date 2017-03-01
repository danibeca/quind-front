(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('requestInterceptor', requestInterceptor)
        .config(config);

    /* @ngInject */
    function requestInterceptor($q, $window, $injector, storage, environmentConfig, toastr) {
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
            var msg = getErrorMessage(rejection);

            if (environmentConfig.env === 'dev') {
                console.log(rejection);
                toastr.error(rejection.config.url + ': ' + msg);
            }

            if (rejection.data.error.statusCode === 401 || rejection.data.error.statusCode === 400) {
                if (msg.includes('Token')) {
                    if (msg.includes('not be verified')) {
                        var deferred = $q.defer();
                        retryHttpRequest(rejection.config, deferred);
                        return deferred.promise;
                    } else {
                        $injector.get('$state').transitionTo('login');
                    }
                }
            }
            return $q.reject(rejection);
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
