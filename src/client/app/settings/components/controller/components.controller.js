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
        vm.croot = storageService.getJsonObject('croot');

        vm.component = {};
        vm.hasComponents = false;
        vm.renderServerForm = false;
        vm.allComponents = [];
        vm.components = [];
        vm.codes = [];

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

        activate();

        function activate() {
            loadInstanceResources();
            loadAllComponents();
            loadComponents();
        }

        function loadAllComponents() {
            var requestData = {
                parent_id: vm.croot.id
            };
            componentService.getList(requestData)
                .then(successGetAllComponents);

            function successGetAllComponents(info) {
                vm.allComponents = info;
                if (vm.allComponents.length > 0){
                    vm.hasComponents = true;
                    vm.renderServerForm = true;
                } else {
                    vm.renderServerForm = true;
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
                vm.component.parent_id = info[0].id;
                vm.componentsLoaded = true;
            }
        }

        function loadInstanceResources() {
            qualityServerService.getInstances({component_id: vm.croot.id, with_resources: true})
                .then(successGetResources)
                .catch(failGetResources);

            function successGetResources(instances) {
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
                vm.component.parent_id = vm.croot.id;
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
            if(vm.component.tag_id != 3) {
                vm.component.parent_id = null;
            }
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
            componentService.hasLeaves(vm.croot.id)
                .then(successHasLeaves);

            function successHasLeaves(hasLeaves) {
                $rootScope.hasLeaves = hasLeaves;
            }
        }

        function showAddComponent() {
            var qsiId =  vm.component.quality_system_instance_id;
            vm.component = {};
            vm.component.parent_id = vm.components[0].id;
            vm.component.quality_system_instance_id = qsiId;
            vm.showCreateForm = true;
        }

        function showEdit(component) {
            vm.component = $.grep(vm.allComponents, function(e){ return e.id === component.id; })[0];
            vm.component.code = component.code
            vm.components = vm.components.filter(function(obj) {
                return vm.component.id !== obj.id;
            });
            if(vm.component.parent_id === null || vm.component.parent_id === undefined) {
                vm.component.parent_id = vm.components[0].id;
            }
            vm.showEditForm = true;
        }
        
        function deleteComponent(component) {
            vm.component = $.grep(vm.allComponents, function(e){ return e.id === component.id; })[0];
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

        function updateName() {
            if (!vm.showEditForm && vm.component.code !== null && vm.component.code !== undefined) {
                vm.component.name = $.grep(vm.codes, function(e){ return e.key === vm.component.code; })[0].name;
            }
        }
    }
})();
