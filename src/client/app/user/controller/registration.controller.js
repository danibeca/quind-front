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
        vm.userComponentData = new Object();


        function registration() {
            userRemoteService.create(vm.user)
                .then(success)
                .catch(fail);

            function success(data) {
                vm.userComponentData.user_id = data.id;
                return createComponent();
            }

            function fail(response) {
                if (response.status === 409) {
                    logger.error($filter('translate')('REGISTER_FAILED'));
                }
            }
        }

        function passwordValidator(password) {

            if(!password){
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
        };

        function createComponent(){
            var dataObj = {
                name : vm.user.company,
                tag_id : 1
            };

            componentService.add(dataObj)
                .then(success)
                .catch(fail);

            function success(resp) {
                storageService.setJsonObject('croot', resp);
                vm.userComponentData.component_id = resp.id;
                associateComponentToUser();
            }

            function fail(error) {
                logger.error($filter('translate')('LOGIN_FAILED'));
            }
        }

        function associateComponentToUser(){
            componentService.associateToUser(vm.userComponentData)
                .then(success)
                .catch(fail);

            function success(data) {
                login();
            }

            function fail(error) {
                logger.error($filter('translate')('LOGIN_FAILED'));
            }
        }

        function login() {
            auth.getLogin(vm.user)
                .then(success)
                .catch(fail);

            function success(data) {
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
                .then(success)
                .catch(fail);

            function success(data) {
                $state.go('settings');
            }

            function fail(error) {
                //logger.error($filter('translate')('LOGIN_FAILED'));
            }

        }
    }
})();
