(function () {
    'use strict';

    angular
        .module('app.user')
        .factory('userRemoteService', userRemoteService);

    /* @ngInject */
    function userRemoteService($http, $q, environmentConfig) {
        var service = {
            create: create,
            createChild:createChild
        };

        return service;

        function create(data) {
            return $http.post(environmentConfig.userAPI + '/users', data)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function createChild(data) {
            return $http.post(environmentConfig.userAPI + '/children', data)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }
    }
})();

