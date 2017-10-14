(function () {
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
                state: 'registration',
                config: {
                    url: '/registration',
                    templateUrl: 'app/user/template/registration.html',
                    controller: 'RegistrationController',
                    controllerAs: 'vm',
                    title: 'Registration',
                    resolve: {
                        translations: function (translateHelper) {
                            return translateHelper.addParts('user');
                        }
                    }
                }
            },

            {
                state: 'login',
                config: {
                    url: '/login',
                    templateUrl: 'app/user/template/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    title: 'login',
                    resolve: {
                        translations: function (translateHelper) {
                            return translateHelper.addParts('user');
                        }
                    }
                }
            },
            {
                state: 'logout',
                config: {
                    url: '/logout',
                    onEnter: function (userService) {
                        userService.logout();
                    },
                    controller: function ($state) {
                        $state.go('login');
                    },
                    title: 'logout'
                }
            },
            {
                state: 'passwordemail',
                config: {
                    url: '/password/email',
                    templateUrl: 'app/user/template/password.email.html',
                    controller: 'PasswordEmailController',
                    controllerAs: 'vm',
                    title: 'forgot',
                    resolve: {
                        translations: function (translateHelper) {
                            return translateHelper.addParts('user');
                        }
                    }
                }
            },
            {
                state: 'passwordreset',
                config: {
                    url: '/password/reset/:token',
                    templateUrl: 'app/user/template/password.reset.html',
                    controller: 'PasswordResetController',
                    controllerAs: 'vm',
                    title: 'reset',
                    resolve: {
                        translations: function (translateHelper) {
                            return translateHelper.addParts('user');
                        }
                    }
                }
            },
        ];
    }
})();
