(function () {
    'use strict';

    angular
        .module('app.account')
        .factory('ciServerService', ciServerService);

    /* @ngInject */
    function ciServerService(cilogAPI, qastaAPI, $q) {
        var service = {
            getList: getList,
            getInstances: getInstances,
            getInstanceResources: getInstanceResources,
            attachInstance: attachInstance,
            isInstanceValid: isInstanceValid,
            updateInstance: updateInstance,
            createPhase: createPhase,
            updatePhase: updatePhase,
            deletePhase: deletePhase,
            addJobToPhase: addJobToPhase,
            updateJobToPhase: updateJobToPhase,
            removeJobFromPhase: removeJobFromPhase,
            getPhases: getPhases,
            getComponentJobs: getComponentJobs
        };
        return service;

        function getList() {
            return cilogAPI.all('ci-systems').getList()
                .then(success)
                .catch(fail);

            function success(server) {
                return server.plain();
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getInstances(data) {
            return cilogAPI.all('ci-system-instances').getList(data)
                .then(success)
                .catch(fail);

            function success(instances) {
                return instances.plain();
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getInstanceResources(componentId) {
            return cilogAPI.one('components', componentId).all('qas').getList({resources: true})
                .then(success)
                .catch(fail);

            function success(instances) {
                return instances.plain();
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function attachInstance(data) {
            return cilogAPI.all('ci-system-instances').post(data)
                .then(success)
                .catch(fail);

            function success(data) {
                return data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function updateInstance(data) {
            return cilogAPI.one('ci-system-instances', data.id).customPUT(data)
                .then(success)
                .catch(fail);

            function success(data) {
                return data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function isInstanceValid(data) {
            return cilogAPI.one('ci-system-instances/verify').get(data)
                .then(successInstanceValid)
                .catch(failInstanceValid);

            function successInstanceValid(response) {
                return response;
            }

            function failInstanceValid() {
                return false;
            }
        }

        function createPhase(data) {
            return qastaAPI.one('components', data.component_owner_id).all('process-phases').post(data)
                .then(successAddPhase)
                .catch(failAddPhase);

            function successAddPhase(element) {
                return cilogAPI.one('components', data.component_owner_id).all('process-phases').post(element)
                    .then(successCreatePhase)
                    .catch(failCreatePhase);

                function successCreatePhase(data) {
                    return data;
                }

                function failCreatePhase(error) {
                    return $q.reject(error);
                }
            }

            function failAddPhase(error) {
                return $q.reject(error);
            }
        }

        function updatePhase(data) {
            return qastaAPI.one('components', data.component_owner_id).one('process-phases', data.id).customPUT(data)
                .then(successUpdatePhase)
                .catch(failUpdatePhase);

            function successUpdatePhase(data) {
                return data;
            }

            function failUpdatePhase(error) {
                return $q.reject(error);
            }
        }

        function deletePhase(data) {
            return qastaAPI.one('components', data.component_owner_id).one('process-phases', data.id).remove()
                .then(successDeleteQasta)
                .catch(failDeleteQasta);

            function successDeleteQasta() {
                return cilogAPI.one('components', data.component_owner_id).one('process-phases', data.id).remove()
                    .then(successDeleteCilog)
                    .catch(failDeleteCilog);

                function successDeleteCilog(cilogResponse) {
                    return cilogResponse;
                }

                function failDeleteCilog(error) {
                    return $q.reject(error);
                }
            }

            function failDeleteQasta(error) {
                return $q.reject(error);
            }
        }

        function addJobToPhase(phaseId, data) {
            return cilogAPI.one('process-phases', phaseId).all('jobs').post(data)
                .then(successAddJob)
                .catch(failAddJob);

            function successAddJob(response) {
                return response;
            }

            function failAddJob() {
                return false;
            }
        }

        function updateJobToPhase(phaseId, data) {
            return cilogAPI.one('process-phases', phaseId).one('jobs', data.id).customPUT(data)
                .then(successAddJob)
                .catch(failAddJob);

            function successAddJob(response) {
                return response;
            }

            function failAddJob() {
                return false;
            }
        }

        function removeJobFromPhase(phaseId, data) {
            return cilogAPI.one('process-phases', phaseId).one('jobs', data.id).remove()
                .then(successAddJob)
                .catch(failAddJob);

            function successAddJob(response) {
                return response;
            }

            function failAddJob() {
                return false;
            }
        }

        function getPhases(data) {
            return qastaAPI.one('components', data.component_owner_id).all('process-phases').getList()
                .then(successPhases)
                .catch(failPhases);

            function successPhases(phasesQasta) {
                var phasesQastaList = phasesQasta.plain();
                return cilogAPI.all('process-phases').getList({component_owner_id: data.component_owner_id})
                    .then(successPhasesCilog)
                    .catch(failPhasesCilog);

                function successPhasesCilog(phasesCilog) {
                    var phasesCilogList = phasesCilog.plain();
                    phasesQastaList.forEach(function (x) {
                        phasesCilogList.forEach(function (y) {
                            if (y.id === x.id) {
                                x.jobs = y.jobs;
                                x.jobs.forEach(function (job) {
                                    if (job.regular_expression !== undefined && job.regular_expression !== null && job.regular_expression !== '') {
                                        job.regularExpressions = job.regular_expression.split(";");
                                    } else {
                                        job.regularExpressions = [];
                                    }
                                });
                            }
                        });
                    });
                    return phasesQastaList;
                }

                function failPhasesCilog(error) {
                    return $q.reject(error);
                }
            }

            function failPhases(error) {
                return $q.reject(error);
            }
        }

        function getComponentJobs(data) {
            return cilogAPI.one('components', data.id).all('process-phases').getList()
                .then(successJobsCilog)
                .catch(failJobsCilog);

            function successJobsCilog(jobsCilog) {
                return jobsCilog.plain();
            }

            function failJobsCilog(error) {
                return $q.reject(error);
            }
        }
    }
})();
