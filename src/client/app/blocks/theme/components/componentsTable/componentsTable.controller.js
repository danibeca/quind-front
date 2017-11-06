/**
 * @author jmruiz6
 * created on 10.28.2017
 */
/* jshint -W101,-W106, -W117 */
// jscs:disable
(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .controller('ComponentsTableCtrl', ComponentsTableCtrl);

    /* @ngInject */
    function ComponentsTableCtrl(componentService, qualityServerService, $scope, $timeout) {
        var vm = this;

        vm.listHasComponents = false;
        vm.showTypes = false;
        vm.showCodes = false;
        vm.showCodeHealth = false;
        vm.showReliability = false;
        vm.showEfficiencyPotential = false;
        vm.showAutomation = false;
        vm.allowAdd = false;
        vm.allowEdit = false;
        vm.allowDelete = false;
        vm.allowViewMore = false;
        vm.crootId = '';
        vm.smartAllComponentsPageSize = 5;
        vm.componentsList = [];
        vm.componentsListSafe = [];
        vm.component = {};
        vm.componentsCodes = [];
        vm.codes = [];
        vm.paginationArray = [{id: 5, name: 5},
            {id: 10, name: 10},
            {id: 15, name: 15},
            {id: 20, name: 20},
            {id: 25, name: 25}];

        vm.setComponents = setComponents;
        vm.setShowTypes = setShowTypes;
        vm.setShowCodes = setShowCodes;
        vm.setShowCodeHealth = setShowCodeHealth;
        vm.setShowReliability = setShowReliability;
        vm.setShowEfficiencyPotential = setShowEfficiencyPotential;
        vm.setShowAutomation = setShowAutomation;
        vm.setAllowAdd = setAllowAdd;
        vm.setAllowEdit = setAllowEdit;
        vm.setAllowDelete = setAllowDelete;
        vm.setAllowViewMore = setAllowViewMore;
        vm.setCrootId = setCrootId;
        vm.updateComponentsCodes = updateComponentsCodes;
        /*************************************
            Methods to set data from directive
         *************************************/
        function setComponents(components) {
            vm.componentsList = components;
            vm.componentsListSafe = JSON.parse(JSON.stringify(vm.componentsList));
            if (vm.componentsList.length > 0){
                vm.smartAllComponentsPageSize = 5;
                if (!vm.showCodes){
                    vm.listHasComponents = true;
                }
                if (isInfoReady()) {
                    updateComponentsCodes();
                }
            }
        }

        function setShowTypes(showTypes) {
            vm.showTypes = showTypes;
        }

        function setShowCodes(showCodes) {
            vm.showCodes = showCodes;
            if (vm.showCodes && vm.crootId !== null && vm.crootId !== undefined){
                loadComponentsCodes();
                loadInstanceResources();
            }
        }

        function setShowCodeHealth(showCodeHealth) {
            vm.showCodeHealth = showCodeHealth;
        }

        function setShowReliability(showReliability) {
            vm.showReliability = showReliability;
        }

        function setShowEfficiencyPotential(showEfficiencyPotential) {
            vm.showEfficiencyPotential = showEfficiencyPotential;
        }
        function setShowAutomation(showAutomation) {
            vm.showAutomation = showAutomation;
        }

        function setCrootId(crootId) {
            vm.crootId = crootId;
            if (vm.showCodes){
                loadComponentsCodes();
                loadInstanceResources();
            }
        }

        function setAllowAdd(allowAdd) {
            vm.allowAdd = allowAdd;
        }

        function setAllowEdit(allowEdit) {
            vm.allowEdit = allowEdit;
        }

        function setAllowDelete(allowDelete) {
            vm.allowDelete = allowDelete;
        }

        function setAllowViewMore(allowViewMore) {
            vm.allowViewMore = allowViewMore;
        }
        /*********************************************
         Methods to load data from remote services
         ********************************************/
        function loadComponentsCodes() {
            var requestData = {
                parent_id: vm.crootId,
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

        function loadInstanceResources() {
            qualityServerService.getInstances({component_id: vm.crootId, with_resources: true})
                .then(successGetResources)
                .catch(failGetResources);

            $scope.$watch('vm.codes', function () {
                if (isInfoReady()) {
                    updateComponentsCodes();
                }
            });

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

        function isInfoReady() {
            if (vm.componentsList.length > 0 && vm.componentsCodes.length > 0 && vm.codes.length > 0) {
                return true;
            }
        }

        function updateComponentsCodes() {
            vm.componentsList.forEach(function(x) {
                if (x.tag_id === 3) {
                    var code = $.grep(vm.componentsCodes, function(e){ return e.id === x.id; })[0];
                    if (code !== null && code!== undefined) {
                        x.code = code.app_code;
                        x.code_name = $.grep(vm.codes, function(e){ return e.key === x.code; })[0].name;
                    }
                }
            });
            var delay = 0;
            $timeout(function () {
                vm.listHasComponents = true;
            }, delay);
        }
    }
})();
