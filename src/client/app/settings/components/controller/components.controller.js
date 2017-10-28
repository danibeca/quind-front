/* jshint -W117, -W101, -W106  */
// jscs:disable
(function () {
    'use strict';

    angular
        .module('app.settings')
        .controller('ComponentsController', ComponentsController);

    /* @ngInject */
    function ComponentsController(userService, storageService, componentService, qualityServerService, logger, $filter, $state, $scope) {
        var vm = this;
        var croot = storageService.getJsonObject('croot');

        vm.component = {};
        vm.hasComponents = false;
        vm.renderServerForm = false;
        vm.allComponents = [];
        vm.componentsCodes = [];
        vm.components = [];

        vm.smartAllComponentsPageSize = 5;
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

        activate();

        function activate() {
            loadInstanceResources();
            loadAllComponents();
            loadComponentsCodes();
            loadComponents();
        }

        function loadAllComponents() {
            var requestData = {
                parent_id: croot.id
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
                if (vm.allComponents.length > 0){
                    vm.hasComponents = true;
                    vm.renderServerForm = true;
                } else {
                    vm.renderServerForm = true;
                }
                vm.smartAllComponentsPageSize = 5;
            }
        }

        function loadComponentsCodes() {
            var requestData = {
                parent_id: croot.id,
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

        function isInfoReady() {
            if (vm.allComponents.length > 0 && vm.componentsCodes.length > 0) {
                return true;
            }
        }

        function updateComponentsCodes() {
            vm.allComponents.forEach(function(x) {
                if (x.tag_id === 3) {
                    var code = $.grep(vm.componentsCodes, function(e){ return e.id === x.id; })[0];
                    x.code = code.app_code;
                }
            });
        }

        function loadComponents() {
            var requestData = {
                parent_id: croot.id,
                no_leaves: true
            };
            componentService.getList(requestData)
                .then(successGetComponents);

            function successGetComponents(info) {
                vm.components = info;
                vm.smartTablePageSize = 5;
                vm.component.parent_id = info[0].id;
                vm.componentsLoaded = true;
            }
        }

        function loadInstanceResources() {
            qualityServerService.getInstances({component_id: croot.id, with_resources: true})
                .then(successGetResources)
                .catch(failGetResources);

            function successGetResources(instances) {
                vm.codes = [];
                instances.forEach(function (instance) {
                    //TODO Change for multiple instances
                    vm.component.quality_system_instance_id = instance.id;
                    vm.codes = vm.codes.concat(instance.resources);
                    vm.resourcesLoaded = true;
                });
            }

            function failGetResources() {
                logger.error($filter('translate')('QUALITY_SYSTEM_ERROR'));
            }
        }

        function componentCodeValidator(code) {
            if (vm.component.tag_id !== 3){
                return true;
            }

            if (code === 0 || code === undefined ){
                return $filter('translate')('FIELD_REQUIRED');
            }
            return true;
        }

        function componentRegistration() {
            vm.showLoader = true;
            if(vm.showEditForm) {
                putComponent();
            } else {
                postComponent();
            }
        }

        function postComponent() {
            if (vm.component.tag_id == 2) {
                vm.component.parent_id = croot.id;
            }
            componentService.create(vm.component)
                .then(successCreateComponent)
                .catch(failCreateComponent);

            function successCreateComponent(component) {
                vm.showLoader = false;
                vm.userComponentData.component_id = component.id;
                vm.userComponentData.user_id = userService.getUser().id;
                associateComponentToUser();
            }

            function failCreateComponent(error) {
                vm.showLoader = false;
                logger.error($filter('translate')('CREATE_COMPONENT_ERROR'));
                console.log(error);
            }
        }

        function putComponent() {
            componentService.update(vm.component)
                .then(successUpdateComponent)
                .catch(failUpdateComponent);

            function successUpdateComponent(component) {
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

            function successAssociate() {
                showMenu();
                loadComponents();
                $state.reload();
                logger.success($filter('translate')('CREATE_COMPONENT_SUCCESS'));
            }
        }

        function showMenu() {
            componentService.hasLeaves(croot.id)
                .then(successHasLeaves);

            function successHasLeaves(hasLeaves) {
                $rootScope.hasLeaves = hasLeaves;
            }
        }

        function showAddComponent() {
            vm.component = {};
            vm.showCreateForm = true;
        }

        function showEdit(componentId) {
            vm.component = $.grep(vm.allComponents, function(e){ return e.id === componentId; })[0];
            vm.showEditForm = true;
        }
        
        function deleteComponent(componentId) {
            vm.component = $.grep(vm.allComponents, function(e){ return e.id === componentId; })[0];
            componentService.deleteComponent(vm.component)
                .then(successDeleteComponent)
                .catch(failDeleteComponent);

            function successDeleteComponent(data) {
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
        }
    }
})();
