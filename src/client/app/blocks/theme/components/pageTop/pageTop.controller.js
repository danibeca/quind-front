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
    function PageTopCtrl(userService, componentService, qualityServerService, $uibModal, $scope, $timeout) {
        var vm = this;
        vm.showAddUser = false;
        vm.showAddComponent = false;

        vm.loadInfo = loadInfo;
        vm.showAddUserOption = showAddUserOption;
        vm.showAddComponentOption = showAddComponentOption;
        vm.loadComponents = loadComponents;
        vm.loadRoles = loadRoles;
        vm.loadInstanceResources = loadInstanceResources;
        vm.openRegisterUser = openRegisterUser;
        vm.openRegisterComponent = openRegisterComponent;

        function loadInfo() {
            vm.showAddUserOption();
            vm.showAddComponentOption();
            vm.loadComponents();
            vm.loadRoles();
            vm.loadInstanceResources();
        }

        function showAddUserOption() {
            //TODO: This logic should work based on the apparently non-existing user roles...
            if (userService.getUser().parent_id === null) {
                vm.showAddUser = true;
            }
        }

        function showAddComponentOption() {
            //TODO: This logic should work based on the apparently non-existing user roles...
            if (userService.getUser().parent_id === null) {
                vm.showAddComponent = true;
            }
        }

        function loadComponents() {
            componentService.getList()
                .then(successInfo)
                .catch(failInfo);

            function successInfo(info) {
                vm.components = info;
                vm.smartTablePageSize = '10';
            }

            function failInfo(error) {
            }
        }

        function loadRoles() {
            userService.getRoles()
                .then(rolesSuccessInfo)
                .catch(rolesFailInfo);

            function rolesSuccessInfo(info) {
                vm.role = info;
            }

            function rolesFailInfo(error) {
            }
        }

        function loadInstanceResources() {
            qualityServerService.getInstanceResources()
                .then(qualitySuccessInfo)
                .catch(qualityFailInfo);

            function qualitySuccessInfo(info) {
                vm.codes = info;
            }

            function qualityFailInfo(error) {
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
    }

})();
