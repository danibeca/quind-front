(function () {
    'use strict';

    angular
        .module('app.account')
        .factory('accountService', accountService);

    /* @ngInject */
    function accountService(Restangular, $q) {
        var service = {
            getInfo: getInfo,
            getIndicators: getIndicators,
            getQA: getQA,
            getIndicator: getIndicator,
            getIndicatorSeries: getIndicatorSeries,
        };
        return service;

        function getInfo(accountId) {
            return Restangular.one('accounts', accountId)
                .getList('details')
                .then(success)
                .catch(fail);

            function success(details) {
                return details.plain();
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getIndicators(accountId) {
            return Restangular.one('accounts', accountId)
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

        function getQA(accountId) {
            return Restangular.one('accounts', accountId)
                .getList('qa')
                .then(success)
                .catch(fail);

            function success(indicators) {
                return indicators.plain();
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getIndicator(accountId, indicatorId) {
            return Restangular.one('accounts', accountId)
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

        function getIndicatorSeries(accountId, indicatorId) {
            return Restangular.one('accounts', accountId)
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
