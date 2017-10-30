/* jshint -W117, -W101, -W106  */
// jscs:disable
(function () {
    'use strict';

    angular
        .module('app.settings')
        .controller('ServersController', ServersController);

    /* @ngInject */
    function ServersController(storageService, qualityServerService, ciServerService, logger, environmentConfig, $filter) {
        var vm = this;

        vm.qalogAPI = environmentConfig.qalogAPI;
        vm.typeOptions = [{'id': 1, 'name': $filter('translate')('PUBLIC')},
            {'id': 2, 'name': $filter('translate')('PRIVATE')}];

        vm.hasQAS = false;
        vm.hasCIS = false;
        vm.qaServers = [];
        vm.ciServers = [];
        vm.qaServerInstances = [];
        vm.ciServerInstances = [];
        vm.qaServer = {};
        vm.ciServer = {type: 1}; //TODO: Je!

        vm.mustShowQAEdit = false;
        vm.mustShowCIEdit = false;
        vm.saveQAS = saveQAS;
        vm.saveCIS = saveCIS;
        vm.showQAEdit = showQAEdit;
        vm.showCIEdit = showCIEdit;
        vm.cancelQAEdit = cancelQAEdit;
        vm.cancelCIEdit = cancelCIEdit;
        vm.userNameValidator = userNameValidator;
        vm.passwordValidator = passwordValidator;
        vm.urlValidator = urlValidator;


        var croot = storageService.getJsonObject('croot');

        activate();

        function activate() {
            loadQAServers();
            loadQAServerInstances();
            loadCIServers();
            loadCIServerInstances();
        }

        function loadQAServers() {
            qualityServerService.getList()
                .then(successServerList);

            function successServerList(data) {
                vm.qaServers = data;
            }
        }

        function loadCIServers() {
            ciServerService.getList()
                .then(successServerList);

            function successServerList(data) {
                vm.ciServers = data;
            }
        }

        function loadQAServerInstances() {
            qualityServerService.getInstances({component_id: croot.id})
                .then(successQAServerInstances);

            function successQAServerInstances(data) {
                vm.renderQAServerForm = true;
                vm.qaServerInstances = data;
                if (data.length > 0) {
                    vm.hasQAS = true;
                }
            }
        }

        function loadCIServerInstances() {
            ciServerService.getInstances({component_id: croot.id})
                .then(successCIServerInstances);

            function successCIServerInstances(data) {
                vm.renderCIServerForm = true;
                vm.ciServerInstances = data;
                if (data.length > 0) {
                    vm.hasCIS = true;
                }
            }
        }

        function checkServer(url, username, password, sendRequestFunction, checkService, sendRequest) {
            var lastChar = url[url.length - 1];
            if (lastChar === '/') {
                url = url.substring(0, url - 1);
            }
            checkService.isInstanceValid({
                'url': url,
                'username': username,
                'password': password
            }).then(successIsValid)
                .catch(failIsValid);

            function successIsValid(data) {
                if (data) {
                    if(sendRequest) {
                        sendRequestFunction(true);
                    }
                } else {
                    vm.showLoader = false;
                    logger.error($filter('translate')('INVALID_URL'));
                }
            }

            function failIsValid(error) {
                vm.showLoader = false;
                logger.error($filter('translate')('INVALID_URL'));
                console.log(error);
            }
        }

        function sendRequestQAS(verified) {
            if (vm.mustShowQAEdit) {
                putEditQAS(verified);
            } else {
                postAddQAS(verified);
            }
        }

        function saveQAS() {
            vm.showLoader = true;
            if (parseInt(vm.qaServer.type) === 1) {
                checkServer(vm.qaServer.url, vm.qaServer.username, vm.qaServer.password, sendRequestQAS, qualityServerService, true);
            } else {
                sendRequestQAS(false);
            }
        }

        function sendRequestCIS(verified) {
            if (vm.mustShowCIEdit) {
                putEditCIS(verified);
            } else {
                postAddCIS(verified);
            }
        }

        function saveCIS() {
            vm.showLoader = true;
            if (parseInt(vm.ciServer.type) === 1) {
                checkServer(vm.ciServer.url_build_server, vm.ciServer.username_build_server,
                    vm.ciServer.password_build_server, sendRequestCIS, ciServerService, false);
                checkServer(vm.ciServer.url_release_manager, vm.ciServer.username_release_manager,
                    vm.ciServer.password_release_manager, sendRequestCIS, ciServerService, true);
            } else {
                sendRequestCIS(false);
            }
        }

        function postAddQAS(verified) {
            var qaData = {
                quality_system_id: vm.qaServer.systemIid,
                type: vm.qaServer.type,
                url: vm.qaServer.url,
                component_id: croot.id,
                username: vm.qaServer.username,
                password: vm.qaServer.password,
                verified: verified

            };

            qualityServerService.attachInstance(qaData)
                .then(successAttachInstance)
                .catch(failAttachInstance);

            function successAttachInstance() {
                vm.showLoader = false;
                loadQAServerInstances();
            }

            function failAttachInstance() {
                vm.showLoader = false;
                logger.error($filter('translate')('CREATE_SERVER_ERROR'));
            }
        }

        function postAddCIS(verified) {
            var ciData = {
                ci_system_id: vm.ciServer.ci_system_id,
                type: 1, //TODO: Je!
                url_build_server: vm.ciServer.url_build_server,
                username_build_server: vm.ciServer.username_build_server,
                password_build_server: vm.ciServer.password_build_server,
                url_release_manager: vm.ciServer.url_release_manager,
                username_release_manager: vm.ciServer.username_release_manager,
                password_release_manager: vm.ciServer.password_release_manager,
                component_owner_id: croot.id,
                verified: verified
            };

            ciServerService.attachInstance(ciData)
                .then(successAttachCIInstance)
                .catch(failAttachCIInstance);

            function successAttachCIInstance() {
                vm.showLoader = false;
                loadCIServerInstances();
            }

            function failAttachCIInstance() {
                vm.showLoader = false;
                logger.error($filter('translate')('CREATE_SERVER_ERROR'));
            }
        }

        function putEditQAS(verified) {
            if (!vm.qaServer.boRequiresAuthentication) {
                vm.qaServer.username = '';
                vm.qaServer.password = '';
            }
            var qaData = {
                id: vm.qaServer.id,
                quality_system_id: vm.qaServer.systemIid,
                type: vm.qaServer.type,
                url: vm.qaServer.url,
                username: vm.qaServer.username,
                password: vm.qaServer.password,
                verified: verified

            };

            qualityServerService.updateInstance(qaData)
                .then(successUpdateQAInstance)
                .catch(failUpdateQAInstance);

            function successUpdateQAInstance() {
                vm.showLoader = false;
                vm.mustShowQAEdit = false;
                vm.qaServer = {}
                loadQAServerInstances();
            }

            function failUpdateQAInstance() {
                logger.error($filter('translate')('UPDATE_SERVER_ERROR'));
            }
        }

        function putEditCIS(verified) {
            if (!vm.ciServer.boRequiresBSAuthentication) {
                vm.ciServer.username_build_server = '';
                vm.ciServer.password_build_server = '';
            }

            if (!vm.ciServer.boRequiresRMAuthentication) {
                vm.ciServer.username_release_manager = '';
                vm.ciServer.password_release_manager = '';
            }

            var ciData = {
                id: vm.ciServer.id,
                ci_system_id: vm.ciServer.ci_system_id,
                type: vm.ciServer.type,
                url_build_server: vm.ciServer.url_build_server,
                username_build_server: vm.ciServer.username_build_server,
                password_build_server: vm.ciServer.password_build_server,
                url_release_manager: vm.ciServer.url_release_manager,
                username_release_manager: vm.ciServer.username_release_manager,
                password_release_manager: vm.ciServer.password_release_manager,
                component_owner_id: croot.id,
                verified: verified
            };

            ciServerService.updateInstance(ciData)
                .then(successUpdateCIInstance)
                .catch(failUpdateCIInstance);

            function successUpdateCIInstance() {
                vm.showLoader = false;
                vm.mustShowCIEdit = false;
                vm.ciServer = {}
                loadCIServerInstances();
            }

            function failUpdateCIInstance() {
                logger.error($filter('translate')('UPDATE_SERVER_ERROR'));
            }
        }

        function showQAEdit() {
            vm.mustShowQAEdit = true;
            vm.qaServer.id = vm.qaServerInstances[0].id;
            vm.qaServer.systemIid = vm.qaServerInstances[0].quality_system_id;
            vm.qaServer.type = vm.qaServerInstances[0].type;
            vm.qaServer.url = vm.qaServerInstances[0].url;
            vm.qaServer.username = vm.qaServerInstances[0].username;
            if (vm.qaServer.username !== '' && vm.qaServer.username !== undefined && vm.qaServer.username !== null) {
                vm.qaServer.boRequiresAuthentication = true;
            }
        }

        function showCIEdit() {
            vm.mustShowCIEdit = true;
            vm.ciServer.id = vm.ciServerInstances[0].id;
            vm.ciServer.ci_system_id = vm.ciServerInstances[0].ci_system_id;
            vm.ciServer.type = vm.ciServerInstances[0].type;
            vm.ciServer.url_build_server = vm.ciServerInstances[0].url_build_server;
            vm.ciServer.url_release_manager = vm.ciServerInstances[0].url_release_manager;
            vm.ciServer.username_build_server = vm.ciServerInstances[0].username_build_server;
            if (vm.ciServer.username_build_server !== '' && vm.ciServer.username_build_server !== undefined && vm.ciServer.username_build_server !== null) {
                vm.ciServer.boRequiresBSAuthentication = true;
            }
            vm.ciServer.username_release_manager = vm.ciServerInstances[0].username_release_manager;
            if (vm.ciServer.username_release_manager !== '' && vm.ciServer.username_release_manager !== undefined && vm.ciServer.username_release_manager !== null) {
                vm.ciServer.boRequiresRMAuthentication = true;
            }
        }

        function cancelQAEdit() {
            vm.mustShowQAEdit = false;
        }

        function cancelCIEdit() {
            vm.mustShowCIEdit = false;
        }

        function userNameValidator(requiresAuthentication, username) {
            if (requiresAuthentication !== true) {
                return true;
            } else {
                if (username !== '' && username !== undefined && username !== null) {
                    return true;
                }
            }
            return false;
        }

        function passwordValidator(requiresAuthentication, password) {
            if (requiresAuthentication !== true) {
                return true;
            } else {
                if (password !== '' && password !== undefined && password !== null) {
                    return true;
                }
            }
            return false;
        }

        function urlValidator(url) {
            if (!url) {
                return $filter('translate')('REQUIRED_FIELD');
            }
            var expression = /^(http(s?)(:\/\/)?)|((\w+\.)?\w+\.\w+|((2[0-5]{2}|1[0-9]{2}|[0-9]{1,2})\.){3}(2[0-5]{2}|1[0-9]{2}|[0-9]{1,2}))(:[0-9]{1,5})?(\/:.*)?(\/?)$/gm;
            var regex = new RegExp(expression);
            if (!url.match(regex)) {
                return $filter('translate')('INVALID_URL');
            }
            return true;
        }
    }
})();
