(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }


    function getStates() {

        return [
            {
                state: 'dashboard',
                config: {
                    url: '/dashboard',
                    templateUrl: 'app/dashboard/template/dashboard.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm',
                    title: 'DASHBOARD_TITLE',
                    sidebarMeta: {
                        icon: 'ion-android-home',
                        order: 0,
                    },
                    resolve: {
                        translations: function (translateHelper) {
                            return translateHelper.addParts('dashboard');
                        },
                        croot: function (userService, componentService) {
                            return componentService.getCacheRoot(userService.getUser().id)
                        }

                    }
                }
            },
            {
                state: 'home',
                config: {
                    url: '/',
                    controller: function ($state) {
                        $state.go('dashboard');
                    },
                    title: 'home'
                }
            }
        ];
    }
})();

