(function () {
    'use strict';

    angular
        .module('app.user')
        .factory('user', user);

    /* @ngInject */
    function user(storage) {
        var currentUser;

        var service = {
            setUser: setUser,
            getUser: getUser
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
    }
})();
