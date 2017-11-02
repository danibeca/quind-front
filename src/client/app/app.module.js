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

    function runApp($q, $state, userService, auth, componentService, $translatePartialLoader, $transitions, $rootScope) {
        $translatePartialLoader.addPart('general');

        //$transitions.onStart({ to: 'dashboard.**' }, function(trans, state) {
        $transitions.onStart({}, function (trans) {
                var loginState = 'login';
                var stateName = trans.$to().name;


                if (isSecureRoute(stateName)) {
                    return auth.isTokenValid()
                        .then(successToken);


                }
                else if (stateName === loginState) {
                    if (isUserLogged()) {
                        return redirect('dashboard');
                    }
                }

                function successToken(response) {
                    if (isUserLogged()) {
                        if (!isAdminRoute(stateName)) {
                            return hasLeaves().then(successEvalLeaves);
                        }

                    } else {
                        return redirect(loginState);
                    }
                }


                function redirect(newState) {
                    return $state.target(newState);
                }

                function successEvalLeaves(hasLeaves) {
                    if (!hasLeaves) {
                        return redirect('servers');
                    }
                }


                function isSecureRoute(stateName) {
                    var routesNoAuth = ['login', 'registration', 'logout', 'passwordreset', 'passwordemail', '404'];

                    if (routesNoAuth.indexOf(stateName) < 0) {
                        return true;
                    }
                    return false;

                }

                function isAdminRoute(stateName) {
                    var routesNoAuth = ['servers', 'users', 'components'];

                    if (routesNoAuth.indexOf(stateName) < 0) {
                        return false;
                    }
                    return true;

                }


                function isUserLogged() {
                    if (!userService.isLoggedIn()) {
                        return false;
                    }
                    ;
                    return true
                }


                function hasLeaves() {
                    var user = userService.getUser();
                    if (user !== undefined) {
                        return componentService.getRoot(user.id)
                            .then(successRoot);
                    } else {
                        return $q(function (resolve) {
                            resolve(false);
                        });
                    }

                    function successRoot(croot) {
                        return componentService.hasLeaves(croot.id)
                            .then(successHasLeaves);

                        function successHasLeaves(hasLeaves) {
                            return hasLeaves;
                        }
                    }
                }

            }
        );
    }
})
();
