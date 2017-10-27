/* jshint -W117, -W101, -W106  */
// jscs:disable
(function () {
    'use strict';

    angular
        .module('app.settings')
        .controller('ComponentsController', ComponentsController);

    /* @ngInject */
    function ComponentsController(userService, storageService, componentService, qualityServerService, logger, $filter, $state) {
        var vm = this;
        vm.new_component = {};
        var croot = storageService.getJsonObject('croot');
        vm.components = [];
        vm.smartTablePageSize = 5;
        vm.componentsLoaded = false;
        vm.userComponentData = {};
        vm.form = {};
        vm.paginationArray = [{id: 5, name: 5},
            {id: 10, name: 10},
            {id: 15, name: 15},
            {id: 20, name: 20},
            {id: 25, name: 25}];

        vm.componentRegistration = componentRegistration;
        vm.componentCodeValidator = componentCodeValidator;
        vm.loadComponents = loadComponents;

        activate();

        function activate() {
            loadComponents();
        }

        function loadComponents() {


            loadInstanceResources();
            var requestData = {
                parent_id: croot.id,
                no_leaves: true
            };
            componentService.getList(requestData)
                .then(successGetComponents);

            function successGetComponents(info) {
                vm.components = info;
                vm.smartTablePageSize = 5;
                vm.new_component.parent_id = info[0].id;
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
                    vm.new_component.quality_system_instance_id = instance.id;
                    vm.codes = vm.codes.concat(instance.resources);
                    vm.resourcesLoaded = true;
                });
            }

            function failGetResources() {
                logger.error($filter('translate')('QUALITY_SYSTEM_ERROR'));
            }
        }

        function componentCodeValidator(code) {
            if (vm.new_component.type === 1) {
                return true;
            }

            if (code === 0) {
                return $filter('translate')('FIELD_REQUIRED');
            }
            return true;
        }

        function componentRegistration() {
            if (vm.new_component.tag_id == 2) {
                vm.new_component.parent_id = croot.id;
            }
            componentService.create(vm.new_component)
                .then(successCreateComponent)
                .catch(failCreateComponent);

            function successCreateComponent(component) {
                vm.userComponentData.component_id = component.id;
                vm.userComponentData.user_id = userService.getUser().id;
                associateComponentToUser();
            }

            function failCreateComponent(error) {
                logger.error($filter('translate')('CREATE_COMPONENT_ERROR'));
                console.log(error)
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

    }
})();
