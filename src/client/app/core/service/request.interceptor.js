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
            if (environmentConfig.env === 'dev') {
                console.log(rejection);
                var msg = ': ' + rejection.config.url;
                if (rejection.data.error) {
                    msg = rejection.data.error.message + msg;
                } else {
                    msg = JSON.parse(rejection.data).message + msg;
                }

                toastr.error(msg);
            }
            if (rejection.data.error.statusCode === 401 || rejection.data.error.statusCode === 400) {
                var msg = rejection.data.error.message;
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
    }

    /* @ngInject */
    function config($httpProvider) {
        $httpProvider.interceptors.push('requestInterceptor');
    }
})();
