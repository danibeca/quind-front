(function () {
    'use strict';

    angular
        .module('app.user')
        .controller('LoginController', LoginController);

    /* @ngInject */
    function LoginController(logger, auth, $state, $filter, componentService, userService) {
        var vm = this;
        vm.login = login;

        function login() {
            auth.getLogin(vm.credential)
                .then(successLogin)
                .catch(failLogin);

            function successLogin(data) {
                if (data) {
                    componentService.getRoot(userService.getUser().id)
                        .then(successGetRoot);
                } else {
                    logger.error($filter('translate')('LOGIN_FAILED'));
                }

                function successGetRoot(root) {
                    componentService.hasLeaves(root.id)
                        .then(successHasLeaves);

                    function successHasLeaves(hasLeaves) {
                        if (hasLeaves) {
                            $state.go('dashboard');
                        } else {
                            $state.go('servers');
                        }
                        logger.success($filter('translate')('LOGIN_SUCCESS'));
                    }
                }

            }

            function failLogin() {
                logger.error($filter('translate')('LOGIN_FAILED'));
            }
        }
    }
})();
