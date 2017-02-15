(function () {
    'use strict';

    angular.module('app', [
        'app.user',
        'app.dashboard'
    ])
        .run(runApp);

    function runApp($rootScope, $state, $location, user) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (!user.isLoggedIn()) {
                $location.url('/login');
            }
        });
    }

})();
