(function () {
    'use strict';

    angular
        .module('app.systems')
        .factory('systemsService', systemsService);

    /* @ngInject */
    function systemsService(Restangular, $q) {
        var service = {
            getAllSystems: getAllSystems,
            getIndicators: getIndicators,
            getIndicator: getIndicator,
            getIndicatorSeries: getIndicatorSeries
        };
        return service;

        function getAllSystems() {
            return Restangular.all('systems')
                .getList()
                .then(success)
                .catch(fail);

            function success(systems) {
                return systems.plain();
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getIndicators(systemId) {
            return Restangular.one('systems', systemId)
                .getList('indicators')
                .then(success)
                .catch(fail);

            function success(indicators) {
                return indicators.plain();
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getIndicator(systemId, indicatorId) {
            return Restangular.one('systems', systemId)
                .one('indicators', indicatorId).get()
                .then(success)
                .catch(fail);

            function success(indicator) {
                return indicator.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getIndicatorSeries(systemId, indicatorId) {
            return Restangular.one('systems', systemId)
                .one('indicators', indicatorId)
                .getList('series')
                .then(success)
                .catch(fail);

            function success(series) {
                return series.plain();
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
    }

})();
