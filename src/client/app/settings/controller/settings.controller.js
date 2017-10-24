/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.settings')
        .controller('SettingsController', SettingsController);

    /* @ngInject */
    function SettingsController(croot, qualityServerService, logger, $filter) {
        var vm = this;
        vm.hasQAS = false;
        vm.croot = croot.id;
        vm.qas = [];

        vm.addQAS = addQAS;
        vm.urlValidator = urlValidator;

        activate();

        function activate() {
            qualityServerService.getList()
                .then(successServerList);

            function successServerList(data) {
                vm.qAServers = data;
            }

            checkServerInstances();


        }

        function urlValidator(url) {

            if (!url) {
                return $filter('translate')('REQUIRED_FIELD');
            }

            /*var expression = /^http(s?):\/\/((\w+\.)?\w+\.\w+|((2[0-5]{2}|1[0-9]{2}|[0-9]{1,2})\.){3}(2[0-5]{2}|1[0-9]{2}|[0-9]{1,2}))(:[0-9]{1,5})?(\/:.*)?$/gm;
            var regex = new RegExp(expression);


            if (!url.match(regex)) {
                return $filter('translate')('INVALID_URL');
            }*/

            return true;
        };

        function addQAS() {
            if (parseInt(vm.qas.type) === 1) {
                qualityServerService.isInstanceValid(vm.qas.url)
                    .then(successIsValid)
                    .catch(failIsValid);
            }

            function successIsValid(data) {
                if (data) {
                    postAddQAS(true);

                } else {
                    logger.error($filter('translate')('INVALID_URL'));
                }

            }

            function failIsValid(error) {
                logger.error($filter('translate')('INVALID_URL'));
            }

            function postAddQAS(verified) {
                var qaData = {
                    id: vm.qas.id,
                    type: vm.qas.type,
                    url: vm.qas.url,
                    component_id: vm.croot,
                    verified: verified

                };
                qualityServerService.attachInstance(qaData)
                    .then(successAttachInstance);

                function successAttachInstance(data) {
                    checkServerInstances();
                }
            }

        }

        function checkServerInstances() {
            qualityServerService.getInstances({component_id: vm.croot})
                .then(successServerInstances);

            function successServerInstances(data) {
                vm.serverInstances = data;
                if (data.length > 0) {
                    vm.hasQAS = true;
                }
            }

        }
    }
})();
