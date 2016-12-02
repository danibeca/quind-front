(function () {
    'use strict';

    angular
        .module('app.user')
        .factory('auth', auth);

    /* @ngInject */
    function auth($http, environmentConfig, $window, $q, user) {
        var service = {
            getLogin: getLogin
        };

        return service;

        function getLogin(data) {
            return $http.post(environmentConfig.api + '/login', data)
                .then(success)
                .catch(fail);

            function success(response) {
                var result = response.data;
                $window.sessionStorage.token = result.token;
                user.setUser(result);
                return result;
            }

            function fail(error) {
                delete $window.sessionStorage.token;
                return $q.reject(error);
            }
        }
    }
})();
