(function () {
    'use strict';

    angular
        .module('app.user')
        .factory('password', password);

    /* @ngInject */
    function password($http, $q, environmentConfig) {
        var service = {
            getEmail: getEmail,
            postReset: postReset
        };

        return service;

        function getEmail(data) {

            var serviceData = {
                'email': data.email
            };

            return $http.post(environmentConfig.userAPI + '/password/email', serviceData)
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

            return $http.post(environmentConfig.userAPI + '/password/reset', data)
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
