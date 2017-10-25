(function () {
    'use strict';

    angular
        .module('app.account')
        .factory('qualityServerService', qualityServerService);

    /* @ngInject */
    function qualityServerService(qalogAPI, $q) {
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
            return qalogAPI.all('quality-systems').getList()
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

            return qalogAPI.all('quality-system-instances').getList(data)
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
            return qalogAPI.one('components', componentId).all('qas').getList({resources: true})
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
            return qalogAPI.all("quality-system-instances").post(data)
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
            return qalogAPI.one("quality-system-instances", data.id).customPUT(data)
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
            return qalogAPI.one('quality-system-instances/verify').get(data)
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
