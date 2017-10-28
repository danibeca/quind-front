/* jshint -W101,-W106, -W117 */
// jscs:disable
(function () {
    'use strict';

    angular
        .module('app.account')
        .factory('componentService', componentService);

    /* @ngInject */
    function componentService(accountAPI, qastaAPI, qalogAPI, $q, storageService) {
        var service = {
            createAccount: createAccount,
            create: create,
            update: update,
            deleteComponent: deleteComponent,
            getRoot: getRoot,
            getRemoteRoot: getRemoteRoot,
            hasLeaves: hasLeaves,
            getInfo: getInfo,
            getIndicators: getIndicators,
            getIndicatorSeries: getIndicatorSeries,
            getQAAttributes: getQAAttributes,
            add: add,
            getList: getList,
            getQalogList: getQalogList,
            associateToUser: associateToUser
        };
        return service;

        function createAccount(data) {
            return createGeneral('accounts',data);
        }

        function create(data) {
            return createGeneral('components',data);
        }

        function update(data) {
            return accountAPI.one('components', data.id).customPUT(data)
                .then(successUpdate)
                .catch(failUpdate);

            function successUpdate(response) {
                var componentData = {
                    id: response.id,
                    type_id: response.type_id,
                    parent_id: response.parent_id
                };
                qastaAPI.one('components', componentData.id).customPUT(componentData);
                if(response.type_id === 3){
                    componentData.quality_system_instance_id = data.quality_system_instance_id;
                    componentData.app_code = data.code;
                }

                qalogAPI.one('components', componentData.id).customPUT(componentData);
                return response;
            }

            function failUpdate(error) {
                return $q.reject(error);
            }
        }

        function deleteComponent(data){
            return accountAPI.one('components', data.id).remove()
                .then(successDelete)
                .catch(failDelete);

            function successDelete(response) {
                return response.data;
            }

            function failDelete(error) {
                return $q.reject(error);
            }
        }

        function createGeneral(resource,dataCreateGeneral) {
            return accountAPI.all(resource).post(dataCreateGeneral)
                .then(successCreateGeneral)
                .catch(failCreateGeneral);

            function successCreateGeneral(response) {
                var componentData = {
                    id: response.id,
                    type_id: response.type_id,
                    parent_id: response.parent_id
                };
                qastaAPI.all('components').post(componentData);
                if(response.type_id === 3){
                    componentData.quality_system_instance_id = dataCreateGeneral.quality_system_instance_id;
                    componentData.app_code = dataCreateGeneral.code;
                }

                qalogAPI.all('components').post(componentData);
                return response;
            }

            function failCreateGeneral(error) {
                return $q.reject(error);
            }
        }

        function getRoot(userId) {
            if (!storageService.has('croot')) {
                return getRemoteRoot(userId)
                    .then(successGetRoot);

            } else {
                return $q(function (resolve) {
                    resolve(storageService.getJsonObject('croot'));
                });
            }

            function successGetRoot(resp) {
                storageService.setJsonObject('croot', resp);
                return resp;
            }
        }

        function getRemoteRoot(userId) {

            return accountAPI.one('users', userId).getList('croot')
                .then(successGetRemoteRoot)
                .catch(failGetRemoteRoot);

            function successGetRemoteRoot(response) {
                return response.plain()[0];
            }

            function failGetRemoteRoot(error) {
                return $q.reject(error);
            }

        }

        function hasLeaves(componentId) {
            return accountAPI.one('components', componentId)
                .get({hasLeaves: true})
                .then(successLeaves)
                .catch(failLeaves);

            function successLeaves(details) {
                return details;
            }

            function failLeaves(error) {
                return $q.reject(error);
            }
        }

        function getQalogList(data) {
            return qalogAPI.all('components').getList(data)
                .then(successGetList)
                .catch(failGetList);

            function successGetList(response) {
                return response.plain();
            }

            function failGetList(error) {
                return $q.reject(error);
            }
        }

        function getList(data) {
            return accountAPI.all('components').getList(data)
                .then(successGetList)
                .catch(failGetList);

            function successGetList(response) {
                return response.plain();
            }

            function failGetList(error) {
                return $q.reject(error);
            }
        }

        function associateToUser(data) {
            return accountAPI.one('components', data.component_id).all('users').post(data)
                .then(successAssociate)
                .catch(failAssociate);

            function successAssociate(response) {
                return response;
            }

            function failAssociate(error) {
                return $q.reject(error);
            }
        }

        function getInfo(componentId) {
            return qastaAPI.one('components', componentId)
                .get({details: true})
                .then(success13)
                .catch(fail13);

            function success13(details) {
                return details.plain().data;
            }

            function fail13(error) {
                return $q.reject(error);
            }
        }

        function getIndicators(componentId, indicatorIds) {
            if (indicatorIds !== null) {
                return qalogAPI.all('indicators').getList({ids: indicatorIds})
                    .then(successName)
                    .catch(failName);
            }

            function successName(names) {
                return qastaAPI.one('components', componentId).getList('indicators', {ids: indicatorIds})
                    .then(success)
                    .catch(fail);

                function success(indicators) {
                    var result = [];
                    names.plain().forEach(function (name) {
                        indicators.plain().forEach(function (indicator) {
                            if (indicator[name.id] !== undefined) {
                                name.value = indicator[name.id].value;
                                result.push(name);
                            }

                        });
                    });
                    return result;


                }

                function fail(error) {
                    return $q.reject(error);
                }
            }

            function failName(error) {
                return $q.reject(error);
            }
        }

        function getIndicatorSeries(componentId, indicatorIds) {
            if (indicatorIds !== null) {
                return qastaAPI.one('components', componentId).getList('indicators', {ids: indicatorIds, series: true})
                    .then(successSerie)
                    .catch(failSerie);
            }

            function successSerie(series) {
                return series;
            }

            function failSerie(error) {
                return $q.reject(error);
            }

        }

        function add(data) {
            return accountAPI.all('components').post(data)
                .then(success1)
                .catch(fail1);

            function success1(response) {
                return response;
            }

            function fail1(error) {
                return $q.reject(error);
            }
        }

        function getQAAttributes(componentId) {
            return qastaAPI.one('components', componentId).getList('attributeissues2')
                .then(success)
                .catch(fail);

            function success(indicators) {
                return indicators.plain();
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

    }

})();
