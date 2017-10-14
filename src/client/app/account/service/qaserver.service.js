(function () {
    'use strict';

    angular
        .module('app.account')
        .factory('qualityServerService', qualityServerService);

    /* @ngInject */
    function qualityServerService(accountAPI, $q) {
        var service = {
            getList: getList,
            getInstances: getInstances,
            getInstanceResources: getInstanceResources,
            attachInstance: attachInstance,
            isInstanceValid: isInstanceValid

        };
        return service;

        function getList() {
            return accountAPI.all('qas').getList()
                .then(success)
                .catch(fail);

            function success(server) {
                return server.plain();
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getInstances(componentId) {
            return accountAPI.one('components', componentId).getList('qas')
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
            return accountAPI.one('components', componentId).all('qas').getList({resources: true})
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
            return accountAPI.one("components", data.component_id).all("qas").post(data)
                .then(success)
                .catch(fail);

            function success(data) {
                return data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function isInstanceValid(serverURL) {
            serverURL = serverURL + '/api/resources';
            return accountAPI.one('qas/validate').get({'url': serverURL})
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail() {
                return false;
            }

        }
    }

})();
