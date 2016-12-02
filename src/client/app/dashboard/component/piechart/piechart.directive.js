/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.dashboard')
        .directive('dashboardPieChart', dashboardPieChart);

    /* @ngInject */
    function dashboardPieChart() {
        return {
            restrict: 'E',
            controller: 'DashboardPieChartCtrl',
            templateUrl: 'app/dashboard/component/piechart/piechart.template.html'
        };
    }
})();
