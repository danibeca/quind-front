/**
 * @author jmruiz6
 * created on 10.21.2017
 */
/* jshint -W101,-W106, -W117 */
// jscs:disable
(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .controller('PageTopCtrl', PageTopCtrl);

    /* @ngInject */
    function PageTopCtrl(userService) {
        var vm = this;
        vm.showAddUser = false;
        vm.showAddComponent = false;
        vm.showAddServer = false;

        activate();

        function activate() {
            showAddUserOption();
            showAddComponentOption();
            showAddServerOption();
        }

        function hasAdminPermission() {
            var result = false;
            userService.getUser().roles.forEach(function (role) {
                if (role.id <= 3) {
                    result = true;
                }
            });

            return result;
        }

        function showAddUserOption() {
            if (hasAdminPermission()) {
                vm.showAddUser = true;
            }
        }

        function showAddComponentOption() {
            if (hasAdminPermission()) {
                vm.showAddComponent = true;
            }
        }

        function showAddServerOption() {
            if (hasAdminPermission()) {
                vm.showAddServer = true;
            }
        }
    }

})();
