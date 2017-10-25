(function () {
    'use strict';

    angular
        .module('app.user')
        .controller('PasswordEmailController', PasswordEmailController);

    /* @ngInject */
    function PasswordEmailController(logger, password, $filter) {
        var vm = this;
        vm.success = false;
        vm.sendEmail = sendEmail;

        function sendEmail() {
            password.getEmail(vm.credential)
                .then(success)
                .catch(fail);

            function success() {
                console.log('success');
                vm.success = true;
            }

            function fail() {
                console.log('error');
                logger.error($filter('translate')('WRONG_EMAIL'));
            }
        }
    }
})();
