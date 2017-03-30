(function () {
    'use strict';

    angular
        .module('app.systems')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }


    function getStates() {

        return [
            {
                state: 'systems',
                config: {
                    url: '/systems',
                    templateUrl: 'app/systems/template/systems.html',
                    controller: 'SystemsController',
                    controllerAs: 'vm',
                    title: 'SYSTEMS_TITLE',
                    sidebarMeta: {
                        icon: 'ion-ios-world',
                        order: 1,
                    },
                    resolve: {
                        translations: function (translateHelper) {
                            return translateHelper.addParts('systems');
                        }

                    }
                }
            },
        ];
    }
})();

