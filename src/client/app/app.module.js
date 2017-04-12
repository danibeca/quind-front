(function () {
    'use strict';

    angular.module('app', [
        'app.dashboard',
        'app.systems',
        'app.applications',
        'app.account'
    ])
        .run(runApp);

    function runApp($rootScope, $state, user, auth, $translatePartialLoader) {
        $translatePartialLoader.addPart('general');
        $rootScope.$on('$stateChangeStart', function (event, toState) {
            var loginState = 'login';
            var routesNoAuth = [loginState, 'logout', 'passwordreset', 'passwordemail', '404'];

            if (routesNoAuth.indexOf(toState.name) < 0) {
                if (!auth.isTokenValid() || !user.isLoggedIn()) {
                    redirect(loginState);
                }
            } else if (toState.name === loginState) {
                if (auth.isTokenValid() && user.isLoggedIn()) {
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
