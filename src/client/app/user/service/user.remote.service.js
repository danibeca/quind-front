(function () {
    'use strict';

    angular
        .module('app.user')
        .factory('userRemoteService', userRemoteService);

    /* @ngInject */
    function userRemoteService($http, $q, environmentConfig) {
        var service = {
            create: create,
            createChild:createChild,
            updateChild:updateChild,
            deleteChild:deleteChild,
            getList: getList
        };

        return service;

        function getList() {
            return $http.get(environmentConfig.userAPI + '/children')
                .then(successGetUsersList)
                .catch(failGetUsersList);

            function successGetUsersList(response) {
                return response.data;
            }

            function failGetUsersList(error) {
                return $q.reject(error);
            }
        }

        function create(data) {
            return $http.post(environmentConfig.userAPI + '/users', data)
                .then(successCreate)
                .catch(failCreate);

            function successCreate(response) {
                return response.data;
            }

            function failCreate(error) {
                return $q.reject(error);
            }
        }

        function createChild(data) {
            return $http.post(environmentConfig.userAPI + '/children', data)
                .then(successCreateChild)
                .catch(failCreateChild);

            function successCreateChild(response) {
                return response.data;
            }

            function failCreateChild(error) {
                return $q.reject(error);
            }
        }

        function updateChild(data) {
            return $http.put(environmentConfig.userAPI + '/children/' + data.id, data)
                .then(successUpdateChild)
                .catch(failUpdateChild);

            function successUpdateChild(response) {
                return response.data;
            }

            function failUpdateChild(error) {
                return $q.reject(error);
            }
        }

        function deleteChild(data) {
            return $http.delete(environmentConfig.userAPI + '/children/' + data.id)
                .then(successDeleteChild)
                .catch(failDeleteChild);

            function successDeleteChild(response) {
                return response.data;
            }

            function failDeleteChild(error) {
                return $q.reject(error);
            }
        }
    }
})();

