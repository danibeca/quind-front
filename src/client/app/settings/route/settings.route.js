(function () {
    'use strict';

    angular
        .module('app.settings')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }


    function getStates() {

        return [
            {
                state: 'servers',
                config: {
                    url: '/servers',
                    templateUrl: 'app/settings/servers/template/servers.html',
                    controller: 'ServersController',
                    controllerAs: 'vm',
                    title: 'SERVERS_TITLE',
                    resolve: {
                        translations: function (translateHelper) {
                            return translateHelper.addParts('settings');
                        }
                    }
                }
            },
            {
                state: 'users',
                config: {
                    url: '/users',
                    templateUrl: 'app/settings/users/template/users.html',
                    controller: 'UsersController',
                    controllerAs: 'vm',
                    title: 'USERS_TITLE',
                    resolve: {
                        translations: function (translateHelper) {
                            return translateHelper.addParts('settings');
                        }
                    }
                }
            },
            {
                state: 'components',
                config: {
                    url: '/components',
                    templateUrl: 'app/settings/components/template/components.html',
                    controller: 'ComponentsController',
                    controllerAs: 'vm',
                    title: 'COMPONENTS_TITLE',
                    resolve: {
                        translations: function (translateHelper) {
                            return translateHelper.addParts('settings');
                        }
                    }
                }
            }
        ];
    }
})();

