(function () {
    'use strict';

    angular
        .module('app.account')
        .factory('ciServerService', ciServerService);

    /* @ngInject */
    function ciServerService(cilogAPI, $q) {
        var service = {
            getList: getList,
            getInstances: getInstances,
            getInstanceResources: getInstanceResources,
            attachInstance: attachInstance,
            isInstanceValid: isInstanceValid,
            updateInstance: updateInstance
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
    }
})();
