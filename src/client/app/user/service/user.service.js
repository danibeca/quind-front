(function () {
    'use strict';

    angular
        .module('app.user')
        .factory('user', user);

    /* @ngInject */
    function user(storage, $window) {
        var currentUser;

        var service = {
            setUser: setUser,
            getUser: getUser,
            isLoggedIn: isLoggedIn,
            logout: logout,
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
            delete $window.sessionStorage.token;
            storage.remove('user');

        }
    }
})();
