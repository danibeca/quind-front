(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('requestInterceptor', requestInterceptor)
        .config(config);

    /* @ngInject */
    function requestInterceptor($q, $injector, storageService, environmentConfig, toastr, userService) {
        var service = {
            request: request,
            responseError: responseError
        };

        return service;

        function request(config) {
            config.headers = config.headers || {};
            var token = storageService.get('token');
            if (token) {
                config.headers.Authorization = 'Bearer ' + token;
            }
            if (storageService.get('lang')) {
                config.headers['Accept-Language'] = storageService.get('lang') + '_US';
            }
            return config;
        }

        function responseError(rejection) {
            //alert(JSON.stringify(rejection));
            var msg = getErrorMessage(rejection);
            if (msg === null) {
                rejection.msgCode = 'HOUSTON_WE_GOT_A_PROBLEM';
            } else {
                if (rejection.data !== undefined && rejection.data.error !== undefined) {
                    rejection.msgCode = rejection.data.error.msgCode;
                }

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
            }

            return $q.reject(rejection);
        }

        function securityRedirect() {
            userService.logout();
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
            if(rejection.data === null){
                securityRedirect();
            }
            if (rejection.data !== undefined && rejection.data.error !== undefined) {
                result = JSON.stringify(rejection.data.error.message);
            }

            return result;
        }
    }

    /* @ngInject */
    function config($httpProvider) {
        $httpProvider.interceptors.push('requestInterceptor');
    }
})();
