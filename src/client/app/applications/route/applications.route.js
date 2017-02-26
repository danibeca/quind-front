(function () {
    'use strict';

    angular
        .module('app.applications')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {

        return [
            {
                state: 'applications',
                config: {
                    url: '/applications',
                    templateUrl: 'app/applications/template/applications.html',
                    controller: 'ApplicationsController',
                    controllerAs: 'vm',
                    title: 'Aplicaciones',
                    sidebarMeta: {
                        icon: 'ion-paper-airplane',
                        order: 1,
                    },
                    resolve: {
                        translations: function (translateHelper) {
                            return translateHelper.addParts('applications');
                        }

                    }
                }
            },
        ];
    }
})();

