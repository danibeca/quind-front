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
    function TopComponentsCtrl($filter) {
        var vm = this;

        vm.hasComponents = false;
        vm.numberSelected = 3;
        vm.components = [];
        vm.orderOne = 0;
        vm.orderTwo = 0;
        vm.orderOptionsCriticals = [];
        vm.orderOptionsOutstanding = [];
        vm.numberOfItemsOptions = [];
        vm.chartName = '';
        vm.title = '';

        vm.setComponents = setComponents;
        vm.orderComponents = orderComponents;
        vm.setNumberOfItems = setNumberOfItems;
        vm.setChartName = setChartName;
        vm.setTitle = setTitle;

        /*************************************
            Methods to set data from directive
         *************************************/
        function setComponents(components) {
            vm.components = components;
            if(vm.components.length > 0) {
                vm.hasComponents = true;
                createOptionsLists();
                createNumberOfItemsOptionsList();
            } else {
                vm.hasComponents = false;
            }
        }

        function createOptionsLists() {
            if(vm.components[0].data !== undefined && vm.components[0].data !== null) {
                var orderOptionsCriticals = [];
                var orderOptionsOutstanding = [];
                vm.components[0].data.forEach(function(x) {
                    var newOptionCritical = {id: x.id, name: 'Críticos en ' + x.name};
                    orderOptionsCriticals.push(newOptionCritical);
                    var newOptionOutstanding = {id: x.id, name: 'Destacados en ' + x.name};
                    orderOptionsOutstanding.push(newOptionOutstanding);
                });
                vm.orderOptionsCriticals = orderOptionsCriticals;
                vm.orderOptionsOutstanding = orderOptionsOutstanding;
            }
        }

        function createNumberOfItemsOptionsList() {
            var numberOfItemsOptions = [];
            if(vm.components.length > 3) {
                var i = 0;
                for(i = 3; i<=vm.components.length; i=i+3) {
                    numberOfItemsOptions.push({id: i, name: i});
                }
                if ((i - 3) !== vm.components.length) {
                    numberOfItemsOptions.push({id: vm.components.length, name: vm.components.length});
                }
            } else
            {
                numberOfItemsOptions.push({id: vm.numberSelected, name: vm.numberSelected});
            }
            vm.numberOfItemsOptions = numberOfItemsOptions;
        }

        function setNumberOfItems(numberOfItems) {
            vm.numberSelected = parseInt(numberOfItems);
        }

        function setChartName(chartName) {
            vm.chartName = chartName;
        }

        function setTitle(title) {
            vm.title = title;
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
            var valueA = $filter('filter')(a.data, {'id': id})[0].value;
            var valueB = $filter('filter')(b.data, {'id': id})[0].value;
            if (inverse) {
                return parseFloat(valueB) - parseFloat(valueA);
            } else {
                return parseFloat(valueA) - parseFloat(valueB);
            }
        }
    }
})();
