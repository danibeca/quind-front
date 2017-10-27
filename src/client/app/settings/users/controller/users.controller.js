/* jshint -W117, -W101, -W106  */
// jscs:disable
(function () {
    'use strict';

    angular
        .module('app.settings')
        .controller('UsersController', UsersController);

    /* @ngInject */
    function UsersController(roleService, userRemoteService, logger, $filter) {
        var vm = this;

        vm.hasUsers = false;

        vm.userRegistration = userRegistration;
        vm.passwordValidator = passwordValidator;
        vm.loadRoles = loadRoles;
        vm.loadUsers = loadUsers;

        activate();

        function activate() {
            loadUsers();
            loadRoles();
        }

        function loadRoles() {
            roleService.getList()
                .then(rolesSuccessInfo);

            function rolesSuccessInfo(info) {
                vm.roles = info;
            }

        }

        function loadUsers() {
            userRemoteService.getList()
                .then(rolesSuccessInfo);

            function rolesSuccessInfo(info) {
                vm.roles = info;
            }

        }

        function passwordValidator(password) {

            if (!password) {
                return $filter('translate')('PASS_REQUIRED');
            }

            if (password.length < 6) {
                return $filter('translate')('PASS_REQUIRED_SIX');
            }

            return true;
        }

        function userRegistration() {
            userRemoteService.createChild(vm.user)
                .then(successCreateChild)
                .catch(failCreateChild);

            function successCreateChild(data) {
                logger.success($filter('translate')('CREATE_USER_SUCCESS'));
                vm.userComponentData.user_id = data.id;
                vm.userComponentData.component_id = vm.crootId;
                componentService.associateToUser(vm.userComponentData);
                $state.reload();
            }

            function failCreateChild(response) {
                if (response.status === 409) {
                    logger.error($filter('translate')('REGISTER_FAILED'));
                }
            }
        }
    }
})();
