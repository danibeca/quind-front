(function () {
    'use strict';

    angular.module('app', [
        'app.settings',
        'app.dashboard',
        'app.systems',
        'app.applications',
        'app.account',
        'angularValidator',
        'smart-table'
    ])
        .run(runApp);

    function runApp($rootScope, $state, userService, auth, appservice, $translatePartialLoader) {
        $translatePartialLoader.addPart('general');
        $rootScope.$on('$stateChangeStart', function (event, toState) {
            var loginState = 'login';
            var routesNoAuth = [loginState, 'registration', 'logout', 'passwordreset', 'passwordemail', '404'];

            if (routesNoAuth.indexOf(toState.name) < 0) {
                if (!auth.isTokenValid() || !userService.isLoggedIn()) {
                    redirect(loginState);
                } else {
                    if (toState.name !== 'settings' && !appservice.hasApplications()) {
                        redirect('settings');
                    }

                }
            } else if (toState.name === loginState) {
                if (auth.isTokenValid() && userService.isLoggedIn()) {
                    redirect('dashboard');
                }
            }

            function redirect(currentState) {
                event.preventDefault();
                $state.go(currentState);


            }
        });
    }
})();
