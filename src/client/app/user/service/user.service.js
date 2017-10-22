(function () {
    'use strict';

    angular
        .module('app.user')
        .factory('userService', userService);

    /* @ngInject */
    function userService(storageService, $q) {
        var currentUser;

        var service = {
            setUser: setUser,
            getUser: getUser,
            getRoles: getRoles,
            isLoggedIn: isLoggedIn,
            logout: logout
        };

        return service;

        function setUser(data) {
            currentUser = data;
            storageService.setJsonObject('user', data);
        }

        function getUser() {
            if (!currentUser) {
                currentUser = storageService.getJsonObject('user');
            }
            return currentUser;
        }

        function getRoles() {
            return $q(function(resolve, reject) {
                setTimeout(function() {
                    resolve([{'id': 1, 'name': 'Administrador'},
                             {'id': 2, 'name': 'Miembro de equipo'}]);

                }, 1000);
            });
        }

        function isLoggedIn() {
            var result = false;
            if (getUser()) {
                result = true;
            }
            return result;
        }

        function logout() {
            storageService.remove('token');
            storageService.remove('refresh_token');
            storageService.remove('user');
            storageService.remove('lastTimeCheck');
            storageService.remove('croot');
            currentUser = undefined;
        }
    }
})();

