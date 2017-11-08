(function () {
    'use strict';

    angular.module('app', [
        'app.settings',
        'app.dashboard',
        'app.systems',
        'app.applications',
        'app.component',
        'app.account'
    ])
        .run(runApp);

    function runApp($q, userService, auth, componentService, $translatePartialLoader, $transitions, $window) {
        $translatePartialLoader.addPart('general');

        $transitions.onStart({}, function (trans) {
                var $state = trans.router.stateService;
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

                function successToken() {
                    if (isUserLogged()) {
                        if (!isAdminRoute(stateName)) {
                            return hasLeaves().then(successEvalLeaves);
                        } else if (!isAdmin()) {
                            return redirect('dashboard');
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
                        if (isAdmin()) {
                            return redirect('servers');
                        } else if (stateName !== 'nothing') {
                            return redirect('nothing');
                        }
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
                    return true;
                }

                function hasLeaves() {
                    var hasLeavesStored = $window.sessionStorage.getItem('hasLeaves');
                    if (hasLeavesStored !== null && hasLeavesStored !== undefined) {
                        return $q(function (resolve) {
                            resolve((hasLeavesStored === 'true'));
                        });
                    } else {
                        var user = userService.getUser();
                        if (user !== undefined) {
                            return componentService.getRoot(user.id)
                                .then(successRoot);
                        } else {
                            return $q(function (resolve) {
                                resolve(false);
                            });
                        }
                    }

                    function successRoot(croot) {
                        return componentService.hasLeaves(croot.id)
                            .then(successHasLeaves);

                        function successHasLeaves(hasLeaves) {
                            $window.sessionStorage.setItem('hasLeaves', hasLeaves);
                            return hasLeaves;
                        }
                    }
                }

                function isAdmin() {
                    var result = false;
                    userService.getUser().roles.forEach(function (role) {
                        if (role.id <= 3) {
                            result = true;
                        }
                    });

                    return result;
                }

            }
        );
    }
})
();
