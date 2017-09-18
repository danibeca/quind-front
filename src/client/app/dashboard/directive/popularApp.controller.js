/**
 * @author danibeca
 * created on 02.22.2017
 */
/* jshint -W101, -W117 */
(function () {
    'use strict';

    angular.module('app.dashboard')
        .controller('PopularAppCtrl', PopularAppCtrl);

    /* @ngInject */
    function PopularAppCtrl($scope) {

        var vm = this;
        if ($scope.vars !== undefined && $scope.vars !== '') {
            vm.details = JSON.parse($scope.vars);
        }


        vm.setDetails = setDetails;

        function setDetails(details) {
            vm.details = details;
        }
    }

})();
