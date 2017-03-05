(function () {
    'use strict';

    angular
        .module('app.applications')
        .factory('appservice', appservice);

    /* @ngInject */
    function appservice(Restangular) {
        var service = {
            getApplications: getApplications,
            getIndicator: getIndicator
        };

        return service;

        function getApplications() {
            return Restangular.all('applications').getList().then(function (applications) {
                return applications.plain();
            });
        }

        function getIndicator(applicationId, indicatorId) {
            return Restangular.one('applications', applicationId)
                .one('indicators', indicatorId)
                .get().then(function (indicator) {
                    return indicator.data;
                });
        }
    }
})();
