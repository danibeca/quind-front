(function () {
    'use strict';

    angular
        .module('app.user')
        .factory('roleService', roleService);

    /* @ngInject */
    function roleService($http, $q, environmentConfig) {
        var service = {
            getList: getList
        };

        return service;

        function getList(data) {
            return $http.get(environmentConfig.userAPI + '/roles')
                .then(successGetList)
                .catch(failGetList);

            function successGetList(response) {
                return response.data;
            }

            function failGetList(error) {
                return $q.reject(error);
            }
        }
    }
})();

