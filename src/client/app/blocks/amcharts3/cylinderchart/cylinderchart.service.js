/**
 * @author jmruiz6
 * created on 10.20.2017
 */
/* jshint -W117, -W101 */
// jscs:disable
(function () {
    'use strict';

    angular
        .module('blocks.amcharts3')
        .factory('cylinderChartService', cylinderChartService);

    /* @ngInject */
    function cylinderChartService() {
        var service = {
            transformData: transformData,
            createChart: createChart
        };

        return service;

        function transformData(data) {
            var result = {};
            result.graphs = [];
            result.data = [];
            data.forEach(function (item, index) {
                result.data.push(buildDataProvider(item));
                var graphs = [];
            });
            data[0].values.forEach(function (valueItem, valueIndex) {
                result.graphs.push(buildGraphProvider(valueIndex, false));
            });
            result.graphs.push(buildGraphProvider(data[0].values.length, true));
            return result;
        }

        function buildGraphProvider(attributeIndex, hideBalloon) {
            var graphProvider = {};
            graphProvider.type = 'column';
            graphProvider.topRadius = 1;
            graphProvider.columnWidth = 0.8;
            graphProvider.showOnAxis = true;
            graphProvider.lineThickness = 2;
            graphProvider.lineAlpha = 0.5;
            graphProvider.lineColor = "lineColor" + attributeIndex;
            graphProvider.fillColorsField = "fillColor" + attributeIndex;
            graphProvider.fillAlphas = 0.8;
            graphProvider.valueField = 'value' + attributeIndex;
            if(hideBalloon) {
                graphProvider.balloonText = "";
            }
            return graphProvider;
        }

        function buildDataProvider(column) {
            var dataProvider  = '{';
            dataProvider = dataProvider + '"category": ' + '"' + column.name + '",';
            var sum = 0;
            column.values.forEach(function(x, index) {
                dataProvider = dataProvider + '"value' + index + '":' + x + ',';
                dataProvider = dataProvider + '"lineColor' + index + '":"' + getColor(x) + '",';
                dataProvider = dataProvider + '"fillColor' + index + '":"' + getColor(x) + '",';
                sum += x;
            });
            dataProvider = dataProvider + '"value' + column.values.length + '":' + (100 - sum) + ',';
            dataProvider = dataProvider + '"lineColor' + column.values.length + '":"#CDCDCD",';
            dataProvider = dataProvider + '"fillColor' + column.values.length + '":"#CDCDCD"';
            dataProvider = dataProvider + '}';
            return JSON.parse(dataProvider);
        }

        function getColor(percentage) {
            var color = '#ED2E08'; //red
            if (percentage >= 80) {
                color = '#5EBE01'; //green
            } else if (percentage < 80 && percentage >= 51) {
                color = '#FFFF4D';//yellow
            } else if (percentage < 51 && percentage >= 39) {
                color = '#FE7903';//orange
            }
            return color;
        }

        function createChart(id, chartProviders) {
            return AmCharts.makeChart(id, {
                "theme": "light",
                "type": "serial",
                "depth3D": 100,
                "angle": 30,
                "autoMargins": false,
                "marginBottom": 100,
                "marginLeft": 30,
                "marginRight": 10,
                "dataProvider": chartProviders.data,
                "valueAxes": [ {
                    "stackType": "100%",
                    "gridAlpha": 0
                }],
                "graphs": chartProviders.graphs,
                "categoryField": "category",
                "categoryAxis": {
                    "axisAlpha": 0,
                    "labelOffset": 40,
                    "gridAlpha": 0
                },
                "export": {
                    "enabled": true
                }
            });
        }
    }
})();
