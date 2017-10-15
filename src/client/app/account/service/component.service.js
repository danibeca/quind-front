(function () {
    'use strict';

    angular
        .module('app.account')
        .factory('componentService', componentService);

    /* @ngInject */
    function componentService(accountAPI, $q) {
        var service = {
            getRoot: getRoot,
            add: add,
            getList:getList,
            associateToUser: associateToUser
        };
        return service;

        function getRoot(userId) {

            return accountAPI.one('users', userId).getList('croot')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.plain()[0];
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function add(data) {
            return accountAPI.all('components').post(data)
                .then(success1)
                .catch(fail1);

            function success1(response) {
                return response;
            }

            function fail1(error) {
                return $q.reject(error);
            }
        }


        function getList(data) {
            return accountAPI.all('components').getList(data)
                .then(success2)
                .catch(fail2);

            function success2(response) {
                return response.plain();
            }

            function fail2(error) {
                return $q.reject(error);
            }
        }


        function associateToUser(data) {

            return accountAPI.one('components', data.component_id).all('users').post(data)
                .then(success3)
                .catch(fail3);

            function success3(response) {
                return response;
            }

            function fail3(error) {
                return $q.reject(error);
            }
        }
    }

})();
