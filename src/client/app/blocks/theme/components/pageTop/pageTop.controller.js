/**
 * @author jmruiz6
 * created on 10.21.2017
 */
/* jshint -W101, -W117 */
(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .controller('PageTopCtrl', PageTopCtrl);

    /* @ngInject */
    function PageTopCtrl(userService, roleService, componentService, qualityServerService, userRemoteService, $uibModal, $scope, $filter) {
        var vm = this;
        vm.showAddUser = false;
        vm.showAddComponent = false;
        vm.userComponentData = new Object();
        vm.crootId;
        vm.new_component = new Object();

        vm.openRegisterUser = openRegisterUser;
        vm.openRegisterComponent = openRegisterComponent;
        vm.userRegistration = userRegistration;
        vm.componentRegistration= componentRegistration;
        vm.passwordValidator = passwordValidator;
        vm.componentCodeValidator = componentCodeValidator;

        activate();

        function activate() {
            showAddUserOption();
            showAddComponentOption();
            loadComponents();
            loadRoles();
        }

        function componentCodeValidator(code) {

            if(vm.new_component.type === 1)
                return true;

            if(code === 0){
                return $filter('translate')('FIELD_REQUIRED');
            }

            return true;
        };

        function passwordValidator(password) {

            if(!password){
                return $filter('translate')('PASS_REQUIRED');
            }

            if (password.length < 6) {
                return $filter('translate')('PASS_REQUIRED_SIX');
            }

            return true;
        };

        function hasAdminPermission() {
            var result = false;
            userService.getUser().roles.forEach(function (role) {
                if (role.id <= 3) {
                    result = true;
                }
            });

            return result;
        }

        function showAddUserOption() {
            if (hasAdminPermission()) {
                vm.showAddUser = true;vm.userComponentData = new Object();
            }
        }

        function showAddComponentOption() {
            if (hasAdminPermission()) {
                vm.showAddComponent = true;
            }
        }

        function loadComponents() {

            componentService.getRoot(userService.getUser().id)
                .then(successGetRoot);

            function successGetRoot(croot) {
                vm.crootId = croot.id;
                var requestData = {
                    parent_id: vm.crootId,
                    self_included: true,
                    no_leaves: true
                }
                componentService.getList(requestData)
                    .then(successGetComponents);

                function successGetComponents(info) {
                    vm.new_component.parent_id = info[0].id;
                    vm.components = info;
                    vm.smartTablePageSize = '5';
                }

                loadInstanceResources();
            }

        }

        function loadRoles() {
            roleService.getList()
                .then(rolesSuccessInfo);

            function rolesSuccessInfo(info) {
                vm.roles = info;
            }

        }

        function loadInstanceResources() {
            qualityServerService.getInstanceResources(vm.crootId)
                .then(successGetResources)
                .catch(failGetResources);

            function successGetResources(info) {
                vm.codes = info;
            }

            function failGetResources(error) {
                logger.error($filter('translate')('QUALITY_SYSTEM_ERROR'));
            }
        }

        function openRegisterUser(page, size) {
            $uibModal.open({
                scope: $scope,
                animation: true,
                templateUrl: page,
                size: size,
                resolve: {
                    components: function () {
                        return vm.components;
                    }
                }
            });
        }

        function openRegisterComponent(page, size) {
            vm.newComponent = [];
            vm.newComponent.type = '0';
            $uibModal.open({
                scope: $scope,
                animation: true,
                templateUrl: page,
                size: size,
                resolve: {
                    components: function () {
                        return vm.components;
                    }
                }
            });
        }

        function userRegistration() {
            userRemoteService.createChild(vm.user)
                .then(successCreateUser)
                .catch(failCreateUser);

            function successCreateUser(data) {
                logger.success($filter('translate')('CREATE_USER_SUCCESS'));
                vm.userComponentData.user_id = data.id;
                vm.userComponentData.component_id = vm.crootId;
                componentService.associateToUser(vm.userComponentData);
            }

            function failCreateUser(response) {
                if (response.status === 409) {
                    logger.error($filter('translate')('REGISTER_FAILED'));
                }
            }
        }

        function componentRegistration() {

            componentService.create(vm.new_component)
                .then(successCreateComponent)
                .catch(failCreateComponent);

            function successCreateComponent(user) {
                vm.userComponentData.user_id = user.id;
                vm.userComponentData.component_id = resp.id;
                associateComponentToUser();
            }

            function failCreateComponent(error) {
                logger.error($filter('translate')('LOGIN_FAILED'));
            }
        }

        function associateComponentToUser(){
            componentService.associateToUser(vm.userComponentData)
                .then(successAssociate())

            function successAssociate() {
                logger.success($filter('translate')('CREATE_COMPONENT_SUCCESS'));
            }


        }
    }

})();
