/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.settings')
        .controller('SettingsController', SettingsController);

    /* @ngInject */
    function SettingsController(croot, qualityServerService, componentService, logger, $filter, $uibModal, $scope) {
        var vm = this;
        vm.hasQAS = false;
        vm.croot = croot.id;

        vm.qas = [];
        vm.qas.type = '0';
        vm.qas.id = '0';

        vm.addQAS = addQAS;

        vm.urlValidator = urlValidator;

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

                }
            }

            qualityServerService.getInstanceResources(vm.croot)
                .then(success2)

            function success2(data) {
                if (data.length > 0) {
                    vm.resources = data;
                }
            }
        }

        function urlValidator(url) {

            if (!url) {
                return $filter('translate')('REQUIRED_FIELD');
            }
            var expression = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
            var regex = new RegExp(expression);


            if (!url.match(regex)) {
                return $filter('translate')('INVALID_URL');
            }

            return true;
        };

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
    }
})();
