/* jshint -W117, -W101, -W106, -W072, -W071 */
// jscs:disable
(function () {
    'use strict';

    angular
        .module('app.settings')
        .controller('ComponentsController', ComponentsController);

    /* @ngInject */
    function ComponentsController(userService, storageService, componentService, qualityServerService, ciServerService, logger, $filter, $state, $uibModal, $scope, $window) {
        var vm = this;
        vm.croot = storageService.getJsonObject('croot');

        vm.component = {};
        vm.hasComponents = false;
        vm.renderServerForm = false;
        vm.allComponents = [];
        vm.components = [];
        vm.codes = [];
        vm.allCodes = [];
        vm.componentsCodes = [];
        vm.hasCIS = false;

        vm.smartTablePageSize = 5;
        vm.componentsLoaded = false;
        vm.userComponentData = {};
        vm.form = {};
        vm.paginationArray = [{id: 5, name: 5},
            {id: 10, name: 10},
            {id: 15, name: 15},
            {id: 20, name: 20},
            {id: 25, name: 25}];
        vm.typesArray = [{id: 2, name: $filter('translate')('SYSTEM')},
            {id: 3, name: $filter('translate')('APPLICATION')}];

        vm.componentRegistration = componentRegistration;
        vm.componentCodeValidator = componentCodeValidator;
        vm.loadComponents = loadComponents;
        vm.showAddComponent = showAddComponent;
        vm.showEdit = showEdit;
        vm.deleteComponent = deleteComponent;
        vm.cancelEdit = cancelEdit;
        vm.updateName = updateName;
        vm.jobDataValidator = jobDataValidator;

        activate();

        function activate() {
            loadInstanceResources();
            loadCIServerInstances();
            loadAllComponents();
            loadComponents();
            loadComponentsCodes();
            loadAllCodes();
        }

        function loadInstanceResources() {
            qualityServerService.getInstances({component_id: vm.croot.id, with_no_used_resources: true})
                .then(successGetResources)
                .catch(failGetResources);

            function successGetResources(instances) {
                instances.forEach(function (instance) {
                    //TODO Change for multiple instances
                    vm.component.quality_system_instance_id = instance.id;
                    vm.codes = vm.codes.concat(instance.resources);
                    vm.resourcesLoaded = true;
                });
                if (instances.length < 1) {
                    vm.typesArray = [{id: 2, name: $filter('translate')('SYSTEM')}];
                }

            }

            function failGetResources() {
                logger.error($filter('translate')('QUALITY_SYSTEM_ERROR'));
            }
        }

        function loadCIServerInstances() {
            ciServerService.getInstances({component_id: vm.croot.id})
                .then(successCIServerInstances);

            function successCIServerInstances(data) {
                vm.ciSystem = data[0];
                if (data.length > 0) {
                    vm.hasCIS = true;
                }
            }
        }

        function loadComponents() {
            var requestData = {
                parent_id: vm.croot.id,
                no_leaves: true
            };
            componentService.getList(requestData)
                .then(successGetComponents);

            function successGetComponents(info) {
                vm.components = info;
                vm.smartTablePageSize = 5;
                if (info.length < 1) {
                    vm.typesArray = [{id: 2, name: $filter('translate')('SYSTEM')}];
                } else {
                    vm.component.parent_id = info[0].id;
                }
                vm.componentsLoaded = true;
            }
        }

        function loadAllComponents() {
            var requestData = {
                parent_id: vm.croot.id
            };
            componentService.getList(requestData)
                .then(successGetAllComponents);

            $scope.$watch('vm.allComponents', function () {
                if (isInfoReady()) {
                    updateComponentsCodes();
                }
            });

            function successGetAllComponents(info) {
                vm.allComponents = info;
                if (vm.allComponents.length > 0) {
                    vm.hasComponents = true;
                    vm.renderServerForm = true;
                } else {
                    vm.renderServerForm = true;
                }
            }
        }

        function loadComponentsCodes() {
            var requestData = {
                parent_id: vm.croot.id,
                only_leaves: true
            };
            componentService.getQalogList(requestData)
                .then(successGetComponentsCodes);

            $scope.$watch('vm.componentsCodes', function () {
                if (isInfoReady()) {
                    updateComponentsCodes();
                }
            });

            function successGetComponentsCodes(info) {
                vm.componentsCodes = info;
            }
        }

        function loadAllCodes() {
            qualityServerService.getInstances({component_id: vm.croot.id, with_resources: true})
                .then(successGetResources)
                .catch(failGetResources);

            function successGetResources(instances) {
                instances.forEach(function (instance) {
                    vm.allCodes = instance.resources;
                });
            }

            function failGetResources() {
                logger.error($filter('translate')('QUALITY_SYSTEM_ERROR'));
            }
        }

        function isInfoReady() {
            if (vm.allComponents.length > 0 && vm.componentsCodes.length > 0) {
                return true;
            }
        }

        function updateComponentsCodes() {
            vm.allComponents.forEach(function(x) {
                if (x.tag_id === 3) {
                    var code = $filter('filter')(vm.componentsCodes, {'id': x.id})[0];
                    if (code !== null && code!== undefined) {
                        x.code = code.app_code;
                    }
                }
            });
        }

        function componentCodeValidator(code) {
            if (vm.component.tag_id !== 3) {
                return true;
            }

            if (code === 0 || code === undefined) {
                return $filter('translate')('FIELD_REQUIRED');
            }
            return true;
        }

        function componentRegistration() {
            vm.showLoader = true;
            if (vm.showEditForm) {
                putComponent();
            } else {
                postComponent();
            }
        }

        function postComponent() {
            if (vm.component.tag_id === 2) {
                vm.component.parent_id = vm.croot.id;
            }
            if(vm.component.tag_id === 3 && vm.hasCIS) {
                vm.component.ci_system_instance_id = vm.ciSystem.id;
            }
            componentService.create(vm.component)
                .then(successCreateComponent)
                .catch(failCreateComponent);

            function successCreateComponent(component) {
                vm.showLoader = false;
                vm.userComponentData.component_id = component.id;
                vm.userComponentData.user_id = userService.getUser().id;
                $window.sessionStorage.removeItem('hasLeaves');
                associateComponentToUser();
            }

            function failCreateComponent(error) {
                vm.showLoader = false;
                logger.error($filter('translate')('CREATE_COMPONENT_ERROR'));
                console.log(error);
            }
        }

        function putComponent() {
            if (vm.component.tag_id !== 3) {
                vm.component.parent_id = null;
            }
            if(vm.component.tag_id === 3 && vm.hasCIS) {
                vm.component.ci_system_instance_id = vm.ciSystem.id;
            }
            componentService.update(vm.component)
                .then(successUpdateComponent)
                .catch(failUpdateComponent);

            function successUpdateComponent() {
                vm.showLoader = false;
                vm.showEditForm = false;
                $state.reload();
            }

            function failUpdateComponent(error) {
                vm.showLoader = false;
                logger.error($filter('translate')('CREATE_COMPONENT_ERROR'));
                console.log(error);
            }
        }

        function associateComponentToUser() {
            componentService.associateToUser(vm.userComponentData)
                .then(successAssociate());
            $state.reload();

            function successAssociate() {
                logger.success($filter('translate')('CREATE_COMPONENT_SUCCESS'));
            }
        }

        function showAddComponent() {
            var qsiId = vm.component.quality_system_instance_id;
            vm.component = {};
            vm.component.parent_id = vm.components[0].id;
            vm.component.quality_system_instance_id = qsiId;
            vm.showCreateForm = true;
        }

        function showEdit(component) {
            vm.component = JSON.parse(JSON.stringify($filter('filter')(vm.allComponents, {'id': component.id})[0]));
            vm.component.code = component.code;
            vm.components = vm.components.filter(function (obj) {
                return vm.component.id !== obj.id;
            });
            if (vm.component.parent_id === null || vm.component.parent_id === undefined) {
                vm.component.parent_id = vm.components[0].id;
            }
            vm.showEditForm = true;
            vm.codes.push($filter('filter')(vm.allCodes, {'key': component.code})[0]);
        }

        function deleteComponent(component) {
            vm.component = $filter('filter')(vm.allComponents, {'id': component.id})[0];
            var deleteMessage = '';
            if (component.tag_id === 2) {
                deleteMessage = $filter('translate')('DELETE_SYSTEM_WARNING_TEXT');
            } else {
                deleteMessage = $filter('translate')('DELETE_APP_WARNING_TEXT');
            }
            var modalInstance = $uibModal.open({
                scope: $scope,
                animation: true,
                templateUrl: 'app/settings/components/modalTemplates/deleteWarningModal.html',
                size: '',
                resolve: {
                }
            });

            $scope.deleteMessage = function() {
                return deleteMessage;
            };

            $scope.ok = function () {
                modalInstance.close();
            };

            $scope.cancel = function () {
                modalInstance.dismiss('cancel');
            };

            modalInstance.result.then(function () {
                callDelete();
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

        function callDelete() {
            componentService.deleteComponent(vm.component)
                .then(successDeleteComponent)
                .catch(failDeleteComponent);

            function successDeleteComponent() {
                $window.sessionStorage.removeItem('hasLeaves');
                $state.reload();
            }

            function failDeleteComponent(response) {
                console.log(response);
                if (response.status === 409) {
                    logger.error($filter('translate')('REGISTER_FAILED'));
                }
            }
        }

        function cancelEdit() {
            vm.showEditForm = false;
            vm.showCreateForm = false;
            var codeToDelete = $filter('filter')(vm.allCodes, {'key': vm.component.code})[0];
            vm.codes.splice(vm.codes.indexOf(codeToDelete), 1);
        }

        function updateName() {
            if (!vm.showEditForm && vm.component.code !== null && vm.component.code !== undefined) {
                vm.component.name = $filter('filter')(vm.codes, {'key': vm.component.code})[0].name;
            }
        }

        function jobDataValidator(data) {
            if(vm.component.tag_id === 3 && vm.hasCIS) {
                if (data !== '' && data !== undefined && data !== null) {
                    return true;
                }
                return false;
            }
            return true;
        }
    }
})();
