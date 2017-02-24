/* jshint -W101, -W117 */
(function () {
    'use strict';

    angular.module('app.dashboard')
        .controller('DashboardLineChartCtrl', DashboardLineChartCtrl);

    /* @ngInject */
    function DashboardLineChartCtrl($scope, $timeout, baConfig, $element, layoutPaths) {

        var vm = this;
        vm.id = $scope.lineid;
        vm.createLineChart = createLineChart;
        vm.updateLineChart = updateLineChart;
        vm.isJsonString = isJsonString;

        function createLineChart(id, dataProvider) {
            var layoutColors = baConfig.colors;
            var lineChart = AmCharts.makeChart(id, {
                type: 'serial',
                theme: 'blur',
                color: layoutColors.defaultText,
                marginTop: 0,
                marginRight: 15,
                dataProvider: dataProvider,
                valueAxes: [
                    {
                        axisAlpha: 0,
                        position: 'left',
                        gridAlpha: 0.5,
                        gridColor: layoutColors.border,
                        minimum: 0,
                        maximum: 100,
                    }
                ],
                graphs: [
                    {
                        id: 'g1',
                        balloonText: '[[value]]',
                        bullet: 'round',
                        bulletSize: 8,
                        lineColor: layoutColors.info,
                        lineThickness: 2,
                        negativeLineColor: layoutColors.info,
                        negativeFillColors: layoutColors.info,
                        negativeLineAlpha: 13,
                        negativeFillAlphas: 12,

                        negativeBase: 60,
                        type: 'smoothedLine',
                        valueField: 'value',

                    }
                ],
                chartScrollbar: {
                    graph: 'g1',
                    gridAlpha: 0,
                    color: layoutColors.defaultText,
                    scrollbarHeight: 55,
                    backgroundAlpha: 0,
                    selectedBackgroundAlpha: 0.05,
                    selectedBackgroundColor: layoutColors.defaultText,
                    graphFillAlpha: 0,
                    autoGridCount: true,
                    selectedGraphFillAlpha: 0,
                    graphLineAlpha: 0.2,
                    selectedGraphLineColor: layoutColors.defaultText,
                    selectedGraphLineAlpha: 1
                },
                chartCursor: {
                    categoryBalloonDateFormat: 'DD/MM/YYYY',
                    cursorAlpha: 0,
                    color: '#FFFFFF',
                    cursorColor: layoutColors.info,
                    valueLineEnabled: true,
                    valueLineBalloonEnabled: true,
                    valueLineAlpha: 0.5,
                    fullWidth: true
                },
                dataDateFormat: 'DD MM YYYY',
                categoryField: 'date',
                categoryAxis: {
                    minPeriod: 'DD',
                    parseDates: true,
                    minorGridAlpha: 0.1,
                    minorGridEnabled: true,
                    gridAlpha: 0.5,
                    gridColor: layoutColors.border,
                },
                export: {
                    enabled: true
                },
                creditsPosition: 'bottom-right',
                pathToImages: layoutPaths.images.amChart
            });

            lineChart.addListener('rendered', zoomChart);
            if (lineChart.zoomChart) {
                lineChart.zoomChart();
            }

            function zoomChart() {
                lineChart.zoomToIndexes(
                    Math.round(lineChart.dataProvider.length * 0.4),
                    Math.round(lineChart.dataProvider.length * 0.55));
            }

            vm.chart = lineChart;
        }

        function updateLineChart(dataProvider) {
            vm.chart.dataProvider = dataProvider;
            vm.chart.validateData();
        }

        function isJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
    }

})();
