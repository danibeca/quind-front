/**
 * @author jmruiz6
 * created on 10.28.2017
 */
/* jshint -W101,-W106, -W117 */
// jscs:disable
(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .controller('TopComponentsCtrl', TopComponentsCtrl);

    /* @ngInject */
    function TopComponentsCtrl() {
        var vm = this;

        vm.hasComponents = false;
        vm.numberOfItems = 3;
        vm.components = [];
        vm.indicators = [];
        vm.orderOne = 0;
        vm.orderTwo = 0;
        vm.orderOptionsCriticals = [];
        vm.orderOptionsOutstanding = [];
        vm.dashChartId = 'dashChart1';

        vm.setComponents = setComponents;
        vm.setIndicators = setIndicators;
        vm.orderComponents = orderComponents;
        vm.setNumberOfItems = setNumberOfItems;

        /*************************************
            Methods to set data from directive
         *************************************/
        function setComponents(components) {
            vm.components = components;
            if(vm.components.length > 0) {
                vm.hasComponents = true;
            }
        }

        function setIndicators(indicators) {
            var i = 1;
            vm.indicators = indicators;
            indicators.forEach(function(x) {
                vm.orderOptionsCriticals.push({id: x.id, name: 'Críticos en ' + x.name});
                vm.orderOptionsOutstanding.push({id: x.id, name: 'Destacados en ' + x.name});
                i++;
            });
        }

        function setNumberOfItems(numberOfItems) {
            vm.numberOfItems = numberOfItems;
        }

        /*********************************************
         Methods to load data from remote services
         ********************************************/
        function orderComponents(inverse) {
            var orderOption = 0;
            if (inverse) {
                orderOption = vm.orderTwo;
                vm.orderOne = 0;
            } else {
                orderOption = vm.orderOne;
                vm.orderTwo = 0;
            }
            vm.components.sort(function(a, b) {return compare(inverse, orderOption, a, b);});
        }

        function compare(inverse, id, a, b) {
            var valueA = $.grep(a.data, function(e) { return e.id === id; })[0].value;
            var valueB = $.grep(b.data, function(e) { return e.id === id; })[0].value;
            if (inverse) {
                return parseFloat(valueB) - parseFloat(valueA);
            } else {
                return parseFloat(valueA) - parseFloat(valueB);
            }
        }
    }
})();
