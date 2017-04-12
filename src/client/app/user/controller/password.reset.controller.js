(function () {
    'use strict';

    angular
        .module('app.user')
        .controller('PasswordResetController', PasswordResetController);

    /* @ngInject */
    function PasswordResetController(logger, $http, $state, $timeout, environmentConfig, $stateParams) {
        var vm = this;
        vm.credential = {};
        vm.credential.token = $stateParams.token;
        vm.resetPassword = resetPassword;

        function resetPassword() {
            $http.post(environmentConfig.api + '/password/reset', vm.credential)
                .then(success)
                .catch(fail);

            function success() {
                vm.success = true;
                $timeout(function () {
                    $state.go('login');
                }, 1000);
            }

            function fail(data) {
                logger.error(data);
            }
        }

    }
})();
