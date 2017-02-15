(function () {
    'use strict';

    angular
        .module('app.user')
        .controller('LogOutController', LogOutController);

    /* @ngInject */
    function LogOutController(user, $window) {
        user.logout();
        $window.location='/login';
    }
})();
