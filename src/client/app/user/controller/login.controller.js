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
                .then(success)
                .catch(fail);

            function success(data) {
                if (data) {
                    logger.success($filter('translate')('LOGIN_SUCCESS'));
                    $state.go('dashboard');
                } else {
                    logger.error($filter('translate')('LOGIN_FAILED'));
                }
            }

            function fail(error) {
                logger.error($filter('translate')('LOGIN_INTERNAL_ERROR'));
                logger.error(error);
            }
        }
    }
})();
