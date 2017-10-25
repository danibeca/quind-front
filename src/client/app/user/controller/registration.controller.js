/* jshint -W101,-W106, -W117 */
// jscs:disable
(function () {
    'use strict';

    angular
        .module('app.user')
        .controller('RegistrationController', RegistrationController);

    /* @ngInject */
    function RegistrationController(logger, userRemoteService, componentService, auth, storageService, $filter, $state) {
        var vm = this;
        vm.registration = registration;
        vm.passwordValidator = passwordValidator;
        vm.userComponentData = {};


        function passwordValidator(password) {

            if (!password) {
                return $filter('translate')('PASS_REQUIRED');
            }

            if (password.length < 6) {
                return $filter('translate')('PASS_REQUIRED_SIX');
            }

            /*if (!password.match(/[A-Z]/)) {
                return "Password must have at least one capital letter";
            }
            if (!password.match(/[0-9]/)) {
                return "Password must have at least one number";
            }*/

            return true;
        }

        function registration() {
            userRemoteService.create(vm.user)
                .then(successCreateUser)
                .catch(failCreateUser);

            function successCreateUser(data) {
                vm.userComponentData.user_id = data.id;
                return createAccount();
            }

            function failCreateUser(response) {
                if (response.status === 409) {
                    logger.error($filter('translate')('REGISTER_FAILED'));
                }
            }
        }

        function createAccount() {
            var accountData = {
                name: vm.user.company
            };

            componentService.createAccount(accountData)
                .then(successCreateAccount)
                .catch(failCreateAccount);

            function successCreateAccount(resp) {
                storageService.setJsonObject('croot', resp);
                vm.userComponentData.component_id = resp.id;
                associateAccountToUser();
            }

            function failCreateAccount() {
                logger.error($filter('translate')('LOGIN_FAILED'));
            }
        }

        function associateAccountToUser() {
            componentService.associateToUser(vm.userComponentData)
                .then(success)
                .catch(fail);

            function success() {
                login();
            }

            function fail() {
                logger.error($filter('translate')('LOGIN_FAILED'));
            }
        }

        function login() {
            auth.getLogin(vm.user)
                .then(success)
                .catch(fail);

            function success() {
                logger.success($filter('translate')('LOGIN_SUCCESS'));
                getUser();
            }

            function fail(error) {
                //logger.error($filter('translate')('LOGIN_FAILED'));
                logger.error(error);
            }

        }

        function getUser() {
            auth.getAuthUser()
                .then(success);


            function success() {
                $state.go('settings');
            }


        }
    }
})();
