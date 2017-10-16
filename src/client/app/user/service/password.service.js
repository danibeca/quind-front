(function () {
    'use strict';

    angular
        .module('app.user')
        .factory('password', password);

    /* @ngInject */
    function password($http, $q, environmentConfig, storageService, userService) {
        var service = {
            getEmail: getEmail,
            postReset: postReset
        };

        return service;

        function getEmail(data) {

            var serviceData = {
                'grant_type' : 'password',
                'client_id' : 2,
                'client_secret' : 'veYPaSOkfdszhDGylgBTuoIiUVsezXiOmwcgvXzu',
                'username' : data.email
            };

            return $http.post(environmentConfig.api + '/password/email', serviceData)
                .then(success)
                .catch(fail);

            function success(response) {
                var result = response.data;
                return result;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function postReset(data) {

            var serviceData = {
                'grant_type' : 'password',
                'client_id' : 2,
                'client_secret' : 'veYPaSOkfdszhDGylgBTuoIiUVsezXiOmwcgvXzu',
                'username' : data.email
            };

            return $http.post(environmentConfig.api + '/password/reset', serviceData)
                .then(success)
                .catch(fail);

            function success(response) {
                var result = response.data;
                return result;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }
    }
})();
