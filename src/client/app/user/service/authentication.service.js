(function () {
    'use strict';

    angular
        .module('app.user')
        .factory('auth', auth);

    /* @ngInject */
    function auth($http, $q, environmentConfig, storage, user) {
        var service = {
            getLogin: getLogin,
            isTokenValid: isTokenValid
        };

        return service;

        function getLogin(data) {
            return $http.post(environmentConfig.api + '/login', data)
                .then(success)
                .catch(fail);

            function success(response) {
                var result = response.data;
                storage.set('token', result.token);
                user.setUser(result);
                return result;
            }

            function fail(error) {
                storage.remove('token');
                return $q.reject(error);
            }
        }

        function isTokenValid() {
            var last = new Date(storage.get('lastT'));
            var now = new Date();
            if (now.getMinutes() - last.getMinutes() > 5) {
                return $http.get(environmentConfig.api + '/token/valid')
                    .then(success)
                    .catch(fail);

            } else {
                return true;
            }

            function success() {
                storage.set('lastT', now);
                return true;
            }

            function fail() {
                user.logout();
                return false;
            }
        }
    }
})();
