(function () {
    'use strict';

    angular
        .module('app.user')
        .controller('LoginController', LoginController);

    /* @ngInject */
    function LoginController(logger, auth, $state, $filter) {
        var vm = this;
        vm.login = login;

        function login() {
            auth.getLogin(vm.credential)
                .then(successLogin)
                .catch(failLogin);

            function successLogin(data) {
                $state.go('dashboard');
                logger.success($filter('translate')('LOGIN_SUCCESS'));
            }

            function failLogin() {
                logger.error($filter('translate')('LOGIN_FAILED'));
            }
        }
    }
})();
