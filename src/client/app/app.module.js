(function () {
    'use strict';

    angular.module('app', [
        'app.user',
        'app.dashboard'
    ])
        .run(runApp);

    function runApp($rootScope, $state, user) {
        $rootScope.$on('$stateChangeStart', function (event, toState) {
            var routesNoAuth = ['login', 'logout', 'passwordreset', 'passwordemail', '404'];
            if (!user.isLoggedIn() && routesNoAuth.indexOf(toState.name) < 0) {
                event.preventDefault();
                $state.go('login');
            }
        });
    }

})();
