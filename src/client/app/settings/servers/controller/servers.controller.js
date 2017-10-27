/* jshint -W117, -W101, -W106  */
// jscs:disable
(function () {
    'use strict';

    angular
        .module('app.settings')
        .controller('ServersController', ServersController);

    /* @ngInject */
    function ServersController(croot, qualityServerService, logger, $filter) {
        var vm = this;

        if(croot === undefined){
            $state.go('login');
        }else{
            vm.croot = croot.id;
        }

        vm.hasQAS = false;

        vm.qas = [];

        vm.saveQAS = saveQAS;
        vm.urlValidator = urlValidator;
        vm.showEdit = showEdit;
        vm.userNameValidator = userNameValidator;
        vm.passwordValidator = passwordValidator;

        activate();

        function activate() {
            qualityServerService.getList()
                .then(successServerList);

            function successServerList(data) {
                vm.qAServers = data;
            }

            checkServerInstances();
            vm.typeOptions = [{'id': 1, 'name': $filter('translate')('PUBLIC')}, {
                'id': 2,
                'name': $filter('translate')('PRIVATE')
            }];
            vm.mustShowEdit = false;
        }

        function urlValidator(url) {

            if (!url) {
                return $filter('translate')('REQUIRED_FIELD');
            }

            /*var expression = /^http(s?):\/\/((\w+\.)?\w+\.\w+|((2[0-5]{2}|1[0-9]{2}|[0-9]{1,2})\.){3}(2[0-5]{2}|1[0-9]{2}|[0-9]{1,2}))(:[0-9]{1,5})?(\/:.*)?$/gm;
            var regex = new RegExp(expressio        vm.qas = [];
n);


            if (!url.match(regex)) {
                return $filter('translate')('INVALID_URL');
            }*/

            return true;
        }

        function saveQAS() {
            if (parseInt(vm.qas.type) === 1) {
                qualityServerService.isInstanceValid({
                    'url': vm.qas.url,
                    'username': vm.qas.username,
                    'password': vm.qas.password
                })
                    .then(successIsValid)
                    .catch(failIsValid);
            }

            function successIsValid(data) {
                if (data) {
                    if (vm.mustShowEdit) {
                        putEditQAS(true);
                    } else {
                        postAddQAS(true);
                    }
                } else {
                    logger.error($filter('translate')('INVALID_URL'));
                }
            }

            function failIsValid(error) {
                logger.error($filter('translate')('INVALID_URL'));
                console.log(error);
            }

            function postAddQAS(verified) {
                var qaData = {
                    quality_system_id: vm.qas.systemIid,
                    type: vm.qas.type,
                    url: vm.qas.url,
                    component_id: vm.croot,
                    username: vm.qas.username,
                    password: vm.qas.password,
                    verified: verified

                };

                function successAttachInstance() {
                    checkServerInstances();
                }

                function failAttachInstance() {
                    logger.error($filter('translate')('CREATE_SERVER_ERROR'));
                }

                qualityServerService.attachInstance(qaData)
                        .then(successAttachInstance)
                        .catch(failAttachInstance);
            }

            function putEditQAS(verified) {
                if (!vm.qas.boRequiresAuthentication) {
                    vm.qas.username = '';
                    vm.qas.password = '';
                }
                var qaData = {
                    id: vm.qas.id,
                    quality_system_id: vm.qas.systemIid,
                    type: vm.qas.type,
                    url: vm.qas.url,
                    username: vm.qas.username,
                    password: vm.qas.password,
                    verified: verified

                };

                function successUpdateInstance() {
                    vm.mustShowEdit = false;
                    checkServerInstances();
                }

                function failUpdateInstance() {
                    logger.error($filter('translate')('UPDATE_SERVER_ERROR'));
                }

                qualityServerService.updateInstance(qaData)
                        .then(successUpdateInstance)
                        .catch(failUpdateInstance);

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

        function showEdit() {
            vm.mustShowEdit = true;
            vm.qas.id = vm.serverInstances[0].id;
            vm.qas.systemIid = vm.serverInstances[0].quality_system_id;
            vm.qas.type = vm.serverInstances[0].type;
            vm.qas.url = vm.serverInstances[0].url;
            vm.qas.username = vm.serverInstances[0].username;
            if (vm.qas.username !== '' && vm.qas.username !== undefined) {
                vm.qas.boRequiresAuthentication = true;
            }
        }

        function userNameValidator() {
            if (vm.qas.boRequiresAuthentication !== true) {
                return true;
            } else {
                if (vm.qas.username !== '' && vm.qas.username !== undefined) {
                    return true;
                }
            }
            return false;
        }

        function passwordValidator() {
            if (vm.qas.boRequiresAuthentication !== true) {
                return true;
            } else {
                if (vm.qas.password !== '' && vm.qas.password !== undefined) {
                    return true;
                }
            }
            return false;
        }
    }
})();
