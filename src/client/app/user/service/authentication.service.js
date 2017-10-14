(function () {
    'use strict';

    angular
        .module('app.user')
        .factory('auth', auth);

    /* @ngInject */
    function auth($http, $q, environmentConfig, storage, userService) {
        var service = {
            getLogin: getLogin,
            isTokenValid: isTokenValid,
            getAuthUser:getAuthUser
        };

        return service;

        function getLogin(data) {

            var serviceData = {
                'grant_type' : 'password',
                'client_id' : 2,
                'client_secret' : 'veYPaSOkfdszhDGylgBTuoIiUVsezXiOmwcgvXzu',
                'username' : data.email,
                'password' : data.password
            };

            //alert(JSON.stringify(serviceData));
            return $http.post(environmentConfig.userAPI + '/oauth/token', serviceData)
                .then(success)
                .catch(fail);

            function success(response) {
                var result = response.data;
                storage.set('token', result.access_token);
                storage.set('refresh_token', result.refresh_token);
                getAuthUser();
                return result;
            }

            function fail(error) {
                storage.remove('token');
                return $q.reject(error);
            }
        }

        function isTokenValid() {
            var last = new Date(storage.get('lastTimeCheck'));
            var now = new Date();
            if (now.getMinutes() - last.getMinutes() > 5) {
                return getAuthUser()
                    .then(success)
                    .catch(fail);

            } else {
                return true;
            }

            function success() {
                storage.set('lastTimeCheck', now);
                return true;
            }

            function fail() {
                userService.logout();
                return false;
            }
        }

        function getAuthUser() {
            return $http.get(environmentConfig.userAPI + '/user')
                .then(success)
                .catch(fail);

            function success(response) {
                userService.setUser(response.data);
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }
    }
})();
