/* jshint -W089 */
(function () {
    'use strict';

    angular
        .module('app.user')
        .controller('PasswordResetController', PasswordResetController);

    /* @ngInject */
    function PasswordResetController(logger, password, $filter, $state, $timeout, $stateParams) {
        var vm = this;
        vm.credential = {};
        vm.credential.token = $stateParams.token;
        vm.resetPassword = resetPassword;

        function resetPassword() {
            password.postReset(vm.credential)
                .then(success)
                .catch(fail);

            function success() {
                vm.success = true;
                $timeout(function () {
                    $state.go('login');
                }, 1000);
            }

            function fail(response) {
                if (response.status === 422) {

                    for (var error in response.data) {

                        for (var detail in response.data[error]) {
                            logger.error(response.data[error][detail]);
                        }
                    }

                }
                else if (response.status === 400) {
                    //alert(JSON.stringify(response.data));
                    //passwords.user
                    //passwords.token
                    if (response.data.error.message.email === 'passwords.user') {
                        logger.error($filter('translate')('WRONG_EMAIL'));
                    }
                    if (response.data.error.message.email === 'passwords.token') {
                        logger.error($filter('translate')('INVALID_TOKEN'));
                    }

                }
                else {
                    logger.error(response);
                }


            }
        }

    }
})();
