(function () {
    'use strict';

    angular
        .module('app.user')
        .factory('userService', userService);

    /* @ngInject */
    function userService(storage) {
        var currentUser;

        var service = {
            setUser: setUser,
            getUser: getUser,
            isLoggedIn: isLoggedIn,
            logout: logout
        };

        return service;

        function setUser(data) {
            currentUser = data;
            storage.setJsonObject('user', data);
        }

        function getUser() {
            if (!currentUser) {
                currentUser = storage.getJsonObject('user');
            }
            return currentUser;
        }

        function isLoggedIn() {
            var result = false;
            if (getUser()) {
                result = true;
            }
            return result;
        }

        function logout() {
            storage.remove('token');
            storage.remove('refresh_token');
            storage.remove('user');
            storage.remove('lastTimeCheck');
            storage.remove('croot');
            currentUser = undefined;
        }
    }
})();

