/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.settings')
        .controller('SettingsController', SettingsController);

    /* @ngInject */
    function SettingsController(croot, userService, qualityServerService, componentService, logger, $filter, $uibModal, $scope) {
        var vm = this;
        vm.user = userService.getUser();
        vm.hasApplications = false;
        vm.hasSystems = false;
        vm.hasQAS = false;
        vm.croot = croot.id;

        vm.qas = [];
        vm.qas.type = '0';
        vm.qas.id = '0';

        vm.addQAS = addQAS;
        vm.addSystem = addSystem;
        vm.addApplication = addApplication;

        vm.open = open;

        activate();

        function activate() {


            qualityServerService.getList()
                .then(success);

            function success(data) {
                vm.qAServers = data;
            }


            qualityServerService.getInstances(vm.croot)
                .then(success1);

            function success1(data) {

                if (data.length > 0) {
                    vm.hasQAS = true;
                    vm.qasInstances = data;
                }
            }

            qualityServerService.getInstanceResources(vm.croot)
                .then(success2)

            function success2(data) {
                if (data.length > 0) {
                    vm.resources = data;
                }
            }

            componentService.getList({parent_id: vm.croot})
                .then(success3);

            function success3(data) {
                if (data.length > 0) {
                    vm.hasSystems = true;
                    vm.components = data;
                }
            }


        }

        function addQAS() {

            qualityServerService.isInstanceValid(vm.qas.url)
                .then(success)
                .catch(fail);

            function success(data) {
                if (data) {
                    vm.qas.component_id = vm.croot;
                    qualityServerService.attachInstance(vm.qas);
                } else {
                    logger.error($filter('translate')('INVALID_URL'));
                }

            }

            function fail(error) {
                logger.error($filter('translate')('INVALID_URL'));
            }
        }

        function addSystem() {
            vm.system.tag_id = 2;
            vm.system.parent_id = vm.croot;
            return addComponent(vm.system);

        }

        function addApplication() {
            vm.app.tag_id = 3;
            return addComponent(vm.app);

        }


        function addComponent(data) {
            componentService.add(data)
                .then(success);

            function success(data) {

            }

        }

        function open(page, size) {
            componentService.getList()
                .then(successInfo)
                .catch(failInfo);

                function successInfo(info) {
                    vm.components = info;
                }

                function failInfo(error) {
                }
            
            
            $uibModal.open({
                scope: $scope,
                animation: true,
                templateUrl: page,
                size: size,
                resolve: {
                    items: function () {
                        return vm.items;
                    },
                    components: function () {
                        return vm.components;
                    }
                }
            });
        };
        
    }
})();
