(function () {
    'use strict';

    angular
        .module('app.user')
        .controller('PasswordEmailController', PasswordEmailController);

    /* @ngInject */
    function PasswordEmailController(logger, $http, $filter, environmentConfig) {
        var vm = this;
        vm.success = false;
        vm.sendEmail = sendEmail;

        function sendEmail() {
            $http.post(environmentConfig.api + '/password/email', vm.credential)
                .then(success)
                .catch(fail);

            function success() {
                vm.success = true;
            }

            function fail() {
                logger.error($filter('translate')('WRONG_EMAIL'));
            }
        }
    }
})();
