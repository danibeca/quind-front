/* jshint -W117, -W101, -W106  */
// jscs:disable
(function () {
    'use strict';

    angular
        .module('app.settings')
        .controller('UsersController', UsersController);

    /* @ngInject */
    function UsersController(roleService, userRemoteService, logger, $filter, $state, storageService, componentService, $scope) {
        var vm = this;

        var croot = storageService.getJsonObject('croot');

        vm.user = {};
        vm.hasUsers = false;
        vm.usersList = [];
        vm.roles = [];
        vm.renderServerForm = false;
        vm.showCreateForm = false;
        vm.showEditForm = false;
        vm.changePassword = false;
        vm.userComponentData = {};
        vm.smartTablePageSize = 5;
        vm.paginationArray = [{id: 5, name: 5},
            {id: 10, name: 10},
            {id: 15, name: 15},
            {id: 20, name: 20},
            {id: 25, name: 25}];

        vm.userRegistration = userRegistration;
        vm.passwordValidator = passwordValidator;
        vm.loadRoles = loadRoles;
        vm.loadUsers = loadUsers;
        vm.showAddUser = showAddUser;
        vm.showEdit = showEdit;
        vm.deleteUser = deleteUser;
        vm.cancelEdit = cancelEdit;

        activate();

        function activate() {
            loadRoles();
            loadUsers();
        }

        function loadRoles() {
            roleService.getList()
                .then(rolesSuccessInfo);

            $scope.$watch('vm.roles', function () {
                if (isInfoReady()) {
                    updateUsersRoles();
                }
            });

            function rolesSuccessInfo(info) {
                vm.roles = info;
            }
        }

        function loadUsers() {
            userRemoteService.getList()
                .then(userSuccessInfo)
                .catch(userFailInfo);

            $scope.$watch('vm.usersList', function () {
                if (isInfoReady()) {
                    updateUsersRoles();
                }
            });

            function userSuccessInfo(info) {
                vm.usersList = info;
                if(vm.usersList.length > 0) {
                    vm.hasUsers = true;
                    vm.renderServerForm = true;
                } else {
                    vm.showCreateForm = true;
                    vm.renderServerForm = true;
                }
            }

            function userFailInfo(error) {
                vm.showCreateForm = true;
                vm.renderServerForm = true;
                console.log(error);
            }
        }

        function isInfoReady() {
            if (vm.usersList.length > 0 && vm.roles.length > 0) {
                return true;
            }
        }

        function updateUsersRoles() {
            vm.usersList.forEach(function(x) {
                x.role_name = $.grep(vm.roles, function(e){ return e.id === x.role_id; })[0].name;
            });
        }

        function passwordValidator(password) {
            if(vm.showCreateForm || vm.changePassword) {
                if (!password) {
                    return $filter('translate')('PASS_REQUIRED');
                }
                if (password.length < 6) {
                    return $filter('translate')('PASS_REQUIRED_SIX');
                }
            }
            return true;
        }

        function userRegistration() {
            vm.showLoader = true;
            if(vm.showEditForm) {
                putChildren();
            } else {
                postChildren();
            }
        }

        function putChildren() {
            userRemoteService.updateChild(vm.user)
                .then(successUpdateChild)
                .catch(failUpdateChild);

            function successUpdateChild(data) {
                vm.showLoader = false;
                vm.showEditForm = false;
                $state.reload();
            }

            function failUpdateChild(response) {
                vm.showLoader = false;
                console.log(response);
                if (response.status === 409) {
                    logger.error($filter('translate')('REGISTER_FAILED'));
                }
            }
        }

        function postChildren() {
            userRemoteService.createChild(vm.user)
                .then(successCreateChild)
                .catch(failCreateChild);

            function successCreateChild(data) {
                associateUser(data);
            }

            function failCreateChild(response) {
                vm.showLoader = false;
                console.log(response);
                if (response.status === 409) {
                    logger.error($filter('translate')('REGISTER_FAILED'));
                }
            }
        }

        function associateUser(data) {
            vm.userComponentData.user_id = data.id;
            vm.userComponentData.component_id = croot.id;
            componentService.associateToUser(vm.userComponentData)
                .then(successAssociateToUser)
                .catch(failAssociateToUser);

            function successAssociateToUser(data) {
                $state.reload();
                logger.success($filter('translate')('CREATE_USER_SUCCESS'));
            }

            function failAssociateToUser(error) {
                $state.reload();
                logger.error($filter('translate')('REGISTER_FAILED'));
                console.log(error);
            }
        }

        function showAddUser() {
            vm.user = {};
            vm.showCreateForm = true;
        }

        function showEdit(userId) {
            vm.user = $.grep(vm.usersList, function(e){ return e.id === userId; })[0];
            vm.showEditForm = true;
        }

        function deleteUser(userId) {
            vm.user = $.grep(vm.usersList, function(e){ return e.id === userId; })[0];
            userRemoteService.deleteChild(vm.user)
                .then(successDeleteChild)
                .catch(failDeleteChild);

            function successDeleteChild(data) {
                $state.reload();
            }

            function failDeleteChild(response) {
                console.log(response);
                if (response.status === 409) {
                    logger.error($filter('translate')('REGISTER_FAILED'));
                }
            }
        }

        function cancelEdit() {
            vm.showEditForm = false;
            vm.showCreateForm = false;
        }
    }
})();
