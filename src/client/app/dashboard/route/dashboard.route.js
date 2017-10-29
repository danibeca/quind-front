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
                        }
                    }
                }
            },
            {
                state: 'home',
                config: {
                    url: '/',
                    controller: function ($state, componentService, userService) {
                        return $state.go('dashboard');
                    },
                    title: 'home'

                }
            }]
    }
})
();

