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

            return true;
        }

        function registration() {
            vm.showLoader = true;
            return userRemoteService.create(vm.user)
                .then(successCreateUser)
                .catch(failCreateUser);

            function successCreateUser(data) {
                vm.userComponentData.user_id = data.id;
                return login();
            }

            function failCreateUser(response) {
                if (response.status === 409) {
                    logger.error($filter('translate')('REGISTER_FAILED'));
                }
            }
        }

        function login() {

            return auth.getLogin(vm.user)
                .then(success)
                .catch(fail);

            function success() {
                logger.success($filter('translate')('LOGIN_SUCCESS'));
                return createAccount();
            }

            function fail(error) {
                logger.error(error);
            }

        }

        function createAccount() {
            var accountData = {
                name: vm.user.company
            };

            return componentService.createAccount(accountData)
                .then(successCreateAccount)

            function successCreateAccount(resp) {
                storageService.setJsonObject('croot', resp);
                vm.userComponentData.component_id = resp.id;
                associateAccountToUser();
                vm.showLoader = false;
                $state.go('servers');
            }
        }

        function associateAccountToUser() {
            componentService.associateToUser(vm.userComponentData);
        }
    }
})();
