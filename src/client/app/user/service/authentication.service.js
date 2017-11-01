/* jshint -W101,-W106, -W117 */
// jscs:disable
(function () {
    'use strict';

    angular
        .module('app.user')
        .factory('auth', auth);

    /* @ngInject */
    function auth($http, $q, environmentConfig, storageService, userService) {
        var service = {
            getLogin: getLogin,
            isTokenValid: isTokenValid,
            getAuthUser: getAuthUser
        };

        return service;

        function getLogin(data) {

            var serviceData = {
                'grant_type': 'password',
                'client_id': 1,
                'client_secret': 'PU8KCsFQKkxaPGfwq2zrtYVHFpwwvgSaYlKNm4zX',
                'username': data.email,
                'password': data.password
            };

            return $http.post(environmentConfig.userAPI + '/oauth/token', serviceData)
                .then(successToken)
                .catch(failToken);

            function successToken(response) {
                var result = response.data;
                storageService.set('token', result.access_token);
                storageService.set('refresh_token', result.refresh_token);
                return getAuthUser();
            }

            function failToken(error) {
                storageService.remove('token');
                return $q.reject(error);
            }
        }

        function isTokenValid() {
            var last = new Date(storageService.get('lastTimeCheck'));
            var now = new Date();
            if (Math.abs(now.getMinutes() - last.getMinutes()) > 5) {
                return getAuthUser()
                    .then(success)
                    .catch(fail);

            } else {
                return $q(function (resolve) {
                    resolve(true);
                });
            }

            function success() {
                storageService.set('lastTimeCheck', now);
                return true;
            }

            function fail() {
                userService.logout();
                return false;
            }
        }

        function getAuthUser() {
            return $http.get(environmentConfig.userAPI + '/user')
                .then(successGetUser)
                .catch(failGetUser);

            function successGetUser(response) {
                userService.setUser(response.data);
                return response.data;
            }

            function failGetUser(error) {
                return $q.reject(error);
            }
        }
    }
})();
