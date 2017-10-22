(function () {
    'use strict';

    angular
        .module('app.account')
        .factory('componentService', componentService);

    /* @ngInject */
    function componentService(accountAPI, qastaAPI, qalogAPI, $q, storageService) {
        var service = {
            createAccount: createAccount,
            hasLeafComponents: hasLeafComponents,
            getCacheRoot: getCacheRoot,
            getInfo: getInfo,
            getRoot: getRoot,
            getIndicators: getIndicators,
            getIndicatorSeries: getIndicatorSeries,
            getQAAttributes: getQAAttributes,
            add: add,
            getList: getList,
            associateToUser: associateToUser
        };
        return service;

        function createAccount(data) {
            return accountAPI.all('accounts').post(data)
                .then(successCreateAccount)
                .catch(failCreateAccount);

            function successCreateAccount(response) {
                var accountData = {
                    id : response.id,
                    type_id : response.type_id
                };
                qastaAPI.all('components').post(accountData);
                qalogAPI.all('components').post(accountData);
                return response;
            }

            function failCreateAccount(error) {
                return $q.reject(error);
            }
        }

        function getInfo(componentId) {
            return qastaAPI.one('components', componentId)
                .get({details:true})
                .then(success13)
                .catch(fail13);

            function success13(details) {
                return details.plain().data;
            }

            function fail13(error) {
                alerts(JSON.stringify('hola'));
                return $q.reject(error);
            }
        }

        function getCacheRoot(userId) {
            if (!storageService.has('croot')) {
                return getRoot(userId)
                    .then(success)

            } else {
                return storageService.getJsonObject('croot');
            }

            function success(resp) {
                storageService.setJsonObject('croot', resp);
                return resp;
            }
        }

        function getRoot(userId) {

            return accountAPI.one('users', userId).getList('croot')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.plain()[0];
            }

            function fail(error) {
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
                    var result = new Array();
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

            function failSerie(series) {
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

        function getList(data) {
            return accountAPI.all('components').getList(data)
                .then(success2)
                .catch(fail2);

            function success2(response) {
                return response.plain();
            }

            function fail2(error) {
                return $q.reject(error);
            }
        }


        function associateToUser(data) {

            return accountAPI.one('components', data.component_id).all('users').post(data)
                .then(success3)
                .catch(fail3);

            function success3(response) {
                return response;
            }

            function fail3(error) {
                return $q.reject(error);
            }
        }
    }

})();
