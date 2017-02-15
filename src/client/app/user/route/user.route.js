(function() {
    'use strict';

    angular
        .module('app.user')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'login',
                config: {
                    url: '/login',
                    templateUrl: 'app/user/template/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    title: 'login',
                    resolve: {
                        translations:  function(translateHelper) {
                            return translateHelper.addParts('user');
                        }
                    }
                }
            },
            {
                state: 'logout',
                config: {
                    url: '/logout',
                    templateUrl: '',
                    controller: 'LogOutController',
                    controllerAs: 'vm',
                    title: 'logout'
                }
            }
        ];
    }
})();
