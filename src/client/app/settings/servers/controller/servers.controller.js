/* jshint -W117, -W101, -W106, -W071 */
// jscs:disable
(function () {
    'use strict';

    angular
        .module('app.settings')
        .controller('ServersController', ServersController);

    /* @ngInject */
    function ServersController(storageService, qualityServerService, ciServerService, logger, environmentConfig, $filter, $uibModal, $scope) {
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
        vm.ciPhase = {};
        vm.ciPhases = [];
        vm.job = {regularExpressions: []};
        vm.editingJob = false;
        vm.hasCIPhases = false;
        vm.ciServer = {type: 1}; //TODO: Je!
        vm.activeJobPosition = null;

        vm.mustShowQAEdit = false;
        vm.mustShowCIEdit = false;
        vm.mustShowCIPhasesPage = false;
        vm.mustShowCIEditPhase = false;
        vm.jobEditing = false;
        vm.jobEditionTitle = $filter('translate')('ADD_JOB');

        vm.saveQAS = saveQAS;
        vm.saveCIS = saveCIS;
        vm.savePhase = savePhase;
        vm.saveJob = saveJob;
        vm.addJobToPhase = addJobToPhase;
        vm.removeJobFromPhase = removeJobFromPhase;
        vm.loadEditJob = loadEditJob;
        vm.cancelJobEdit = cancelJobEdit;
        vm.updateJob = updateJob;
        vm.addRegexToJob = addRegexToJob;
        vm.removeRegexFromJob = removeRegexFromJob;
        vm.deletePhase = deletePhase;
        vm.showQAEdit = showQAEdit;
        vm.showCIEdit = showCIEdit;
        vm.showCIPhasesPage = showCIPhasesPage;
        vm.showEditCIPhase = showEditCIPhase;
        vm.cancelQAEdit = cancelQAEdit;
        vm.cancelCIEdit = cancelCIEdit;
        vm.cancelCIPhaseEdit = cancelCIPhaseEdit;
        vm.userNameValidator = userNameValidator;
        vm.passwordValidator = passwordValidator;
        vm.urlValidator = urlValidator;
        vm.phaseNameValidator = phaseNameValidator;
        vm.jobRegexValidator = jobRegexValidator;
        vm.goBackFunction = goBackFunction;

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
                    loadCIPhases();
                }
            }
        }

        function loadCIPhases() {
            vm.hasCIPhases = false;
            ciServerService.getPhases({component_owner_id: croot.id})
                .then(successCIPhases);

            function successCIPhases(data) {
                vm.renderCIServerForm = true;
                vm.ciPhases = data;
                if (vm.ciPhases.length > 0) {
                    vm.hasCIPhases = true;
                }
            }
        }

        function checkServer(sendRequestFunction, checkService, sendRequest, serverType) {
            var requestData = {};
            var lastChar = '';
            if(serverType === 'qaServer') {
                lastChar = vm.qaServer.url[vm.qaServer.url.length - 1];
                if (lastChar === '/') {
                    vm.qaServer.url = vm.qaServer.url.substring(0, vm.qaServer.url.length - 1);
                }
                requestData = {
                    'url': vm.qaServer.url
                }
                if(vm.qaServer.username !== null && vm.qaServer.username !== undefined && vm.qaServer.username !== '') {
                    requestData.username = vm.qaServer.username;
                }
                if(vm.qaServer.password !== null && vm.qaServer.password !== undefined && vm.qaServer.password !== '') {
                    requestData.password = vm.qaServer.password;
                }
            }

            if(serverType === 'buildServer') {
                    lastChar = vm.ciServer.url_build_server[vm.ciServer.url_build_server.length - 1];
                if (lastChar === '/') {
                    vm.qaServer.url = vm.qaServer.url.substring(0, vm.qaServer.url.length - 1);
                }
                requestData = {
                    'url': vm.ciServer.url_build_server,
                    'username': vm.ciServer.username_build_server,
                    'password': vm.ciServer.password_build_server
                };
            }

            if(serverType === 'releaseServer') {
                    lastChar = vm.ciServer.url_release_manager[vm.ciServer.url_release_manager.length - 1];
                if (lastChar === '/') {
                    vm.qaServer.url = vm.qaServer.url.substring(0, vm.qaServer.url.length - 1);
                }
                requestData = {
                    'url': vm.ciServer.url_release_manager,
                    'username': vm.ciServer.username_release_manager,
                    'password': vm.ciServer.password_release_manager
                };
            }

            checkService.isInstanceValid(requestData).then(successIsValid)
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
            if (!vm.qaServer.boRequiresAuthentication) {
                vm.qaServer.username = '';
                vm.qaServer.password = '';
            }
            vm.showLoader = true;
            if (parseInt(vm.qaServer.type) === 1) {
                checkServer(sendRequestQAS, qualityServerService, true, 'qaServer');
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
                checkServer(sendRequestCIS, ciServerService, false, 'buildServer');
                checkServer(sendRequestCIS, ciServerService, true, 'releaseServer');
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
                vm.qaServer = {};
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
                vm.ciServer = {};
                loadCIServerInstances();
            }

            function failUpdateCIInstance() {
                logger.error($filter('translate')('UPDATE_SERVER_ERROR'));
            }
        }

        function savePhase() {
            vm.showLoader = true;
            if(vm.mustShowCIEditPhase) {
                updatePhase();
            } else {
                addPhase();
            }
        }

        function updatePhase() {
            var phase = {
                component_owner_id: croot.id,
                id: vm.ciPhase.id,
                name: vm.ciPhase.name
            };

            ciServerService.updatePhase(phase)
                .then(successUpdatePhase)
                .catch(failUpdatePhase);

            function successUpdatePhase() {
                vm.showLoader = false;
                vm.mustShowCIEditPhase = false;
                vm.ciPhase = {};
                vm.job = {regularExpressions: []};
                vm.savePhaseForm.reset();
                loadCIPhases();
            }

            function failUpdatePhase() {
                vm.showLoader = false;
                logger.error($filter('translate')('UPDATE_PHASE_ERROR'));
            }
        }

        function addPhase() {
            var phase = {
                component_owner_id: croot.id,
                name: vm.ciPhase.name
            };

            ciServerService.createPhase(phase)
                .then(successAddPhase)
                .catch(failAddPhase);

            function successAddPhase() {
                vm.showLoader = false;
                vm.ciPhase = {};
                vm.job = {regularExpressions: []};
                vm.savePhaseForm.reset();
                loadCIPhases();
            }

            function failAddPhase() {
                vm.showLoader = false;
                logger.error($filter('translate')('CREATE_PHASE_ERROR'));
            }
        }

        function saveJob() {
            vm.showJobLoader = true;
            if(vm.job.id !== null && vm.job.id !== undefined && vm.job.id !== '') {
                updateJob();
            } else {
                addJobToPhase();
            }
        }

        function addJobToPhase() {
            if(vm.job.name !== null && vm.job.name !== undefined && vm.job.name !== '') {
                if(vm.job.regularExpressions.length > 0) {
                    var newJobData = {};
                    newJobData.name = vm.job.name;
                    newJobData.regular_expression = vm.job.regularExpressions.join(';');
                    if (newJobData.regular_expression !== undefined && newJobData.regular_expression !== null && newJobData.regular_expression !== '') {
                        ciServerService.addJobToPhase(vm.ciPhase.id, newJobData)
                            .then(successAddJobToPhase)
                            .catch(failAddJobToPhase);
                        vm.job = {regularExpressions: []};
                        vm.saveJobForm.reset();
                        vm.showJobLoader = false;
                    }
                }
            }
            function successAddJobToPhase(job) {
                if(vm.ciPhase.jobs === undefined || vm.ciPhase.jobs === null || vm.ciPhase.jobs.length === 0) {
                    vm.ciPhase.jobs = [];
                }
                if (job.regular_expression !== undefined && job.regular_expression !== null && job.regular_expression !== '') {
                    job.regularExpressions = job.regular_expression.split(';');
                } else {
                    job.regularExpressions = [];
                }
                vm.ciPhase.jobs.push(job);
            }

            function failAddJobToPhase() {
                vm.showJobLoader = false;
                logger.error($filter('translate')('CREATE_PHASE_ERROR'));
            }
        }

        function removeJobFromPhase(job) {
            ciServerService.removeJobFromPhase(vm.ciPhase.id, job)
                .then(successRemoveJobFromPhase)
                .catch(failRemoveJobFromPhase);

            function successRemoveJobFromPhase() {
                vm.ciPhase.jobs.splice(vm.ciPhase.jobs.indexOf(job), 1);
                vm.editingJob = false;
            }

            function failRemoveJobFromPhase() {
                logger.error($filter('translate')('CREATE_PHASE_ERROR'));
            }
        }

        function loadEditJob(job) {
            vm.job = job;
            vm.jobEditing = true;
            vm.jobEditionTitle = $filter('translate')('UPDATE_JOB');
        }

        function cancelJobEdit() {
            vm.job = {regularExpressions: []};
            vm.jobEditing = false;
            vm.newRegExp = '';
            vm.saveJobForm.reset();
            vm.jobEditionTitle = $filter('translate')('ADD_JOB');
        }

        function addRegexToJob(job) {
            if(vm.newRegExp !== undefined && vm.newRegExp !== null && vm.newRegExp !== '') {
                if(job.regularExpressions === undefined || job.regularExpressions === null) {
                    job.regularExpressions = [];
                }
                if(job.regularExpressions.indexOf(vm.newRegExp) === -1) {
                    job.regularExpressions.push(vm.newRegExp);
                }
                vm.newRegExp = '';
            }
        }

        function removeRegexFromJob(job, regExp) {
            if(job.regularExpressions.length > 1) {
                job.regularExpressions.splice(job.regularExpressions.indexOf(regExp), 1);
            } else {
                var modalInstance = $uibModal.open({
                    scope: $scope,
                    animation: true,
                    templateUrl: 'app/settings/servers/modalTemplates/atLeastOneRegexWarningModal.html',
                    size: '',
                    resolve: {}
                });

                $scope.ok = function () {
                    modalInstance.close();
                };
            }
        }

        function updateJob() {
            var newJobData = {};
            newJobData.id = vm.job.id;
            newJobData.name = vm.job.name;
            newJobData.regular_expression = vm.job.regularExpressions.join(';');
            ciServerService.updateJobToPhase(vm.ciPhase.id, newJobData)
                .then(successUpdateJobToPhase)
                .catch(failUpdateJobToPhase);

            function successUpdateJobToPhase() {
                vm.job = {regularExpressions: []};
                vm.saveJobForm.reset();
                vm.jobEditing = false;
                vm.showJobLoader = false;
            }

            function failUpdateJobToPhase() {
                vm.showJobLoader = false;
                logger.error($filter('translate')('UPDATE_PHASE_ERROR'));
            }
        }

        function deletePhase(phase) {
            ciServerService.deletePhase(phase)
                .then(successDeletePhase)
                .catch(failDeletePhase);

            function successDeletePhase() {
                vm.showLoader = false;
                vm.mustShowCIEditPhase = false;
                vm.ciPhase = {};
                loadCIPhases();
            }

            function failDeletePhase() {
                vm.showLoader = false;
                logger.error($filter('translate')('DELETE_PHASE_ERROR'));
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

        function showCIPhasesPage() {
            vm.mustShowCIPhasesPage = true;
        }

        function showEditCIPhase(phase) {
            vm.ciPhase = phase;
            vm.job = {regularExpressions: []};
            vm.saveJobForm.reset();
            vm.mustShowCIEditPhase = true;
            if(vm.ciPhase.jobs === undefined || vm.ciPhase.jobs === null) {
                vm.ciPhase.jobs = [];
            }
        }

        function cancelQAEdit() {
            vm.mustShowQAEdit = false;
        }

        function cancelCIEdit() {
            vm.mustShowCIEdit = false;
        }

        function cancelCIPhaseEdit() {
            vm.ciPhase = {};
            vm.mustShowCIEditPhase = false;
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

        function phaseNameValidator(phaseName) {
            if (phaseName !== '' && phaseName !== undefined && phaseName !== null) {
                return true;
            }
            return false;
        }

        function jobRegexValidator() {
            if (vm.job.regularExpressions.length < 1) {
                if (vm.newRegExp !== undefined && vm.newRegExp !== null && vm.newRegExp !== '') {
                    return $filter('translate')('ADD_REGEX_TEXT');
                } else {
                    return $filter('translate')('REQUIRED_REGEX_FIELD');
                }
            } else {
                if (vm.newRegExp !== undefined && vm.newRegExp !== null && vm.newRegExp !== '') {
                    return $filter('translate')('ADD_REGEX_TEXT');
                }
            }
            return true;
        }

        function goBackFunction() {
            vm.mustShowCIPhasesPage = false;
        }
    }
})();
