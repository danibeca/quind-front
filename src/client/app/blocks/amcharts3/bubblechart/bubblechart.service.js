/**
 * @author jmruiz6
 * created on 10.20.2017
 */
/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('blocks.amcharts3')
        .factory('bubbleChartService', bubbleChartService);

    /* @ngInject */
    function bubbleChartService(layoutPaths) {
        var service = {
            transformData: transformData,
            createChart: createChart
        };

        return service;

        function transformData(attributesArray) {
            var result = {};
            result.graphs = [];
            attributesArray.forEach(function (item, index) {
                result.graphs.push(getChartProvider(item.name, item.balloonText, index + 1));
            });
            result.data = getDataProviders(attributesArray);
            return result;
        }

        function getChartProvider(attributeTitle, attributeBalloonText, attributeIndex) {
            var result = {};
            result.balloonText = attributeBalloonText;
            result.bullet = 'circle';
            result.lineAlpha = 0;
            result.valueField = 'value' + attributeIndex;
            result.xField = 'x' + attributeIndex;
            result.yField = 'y' + attributeIndex;
            result.fillAlphas = 0;
            result.maxBulletSize = 80;
            result.title = attributeTitle;
            result.minBulletSize = 15;
            result.bulletBorderAlpha = 1;
            result.bulletBorderThickness = 2;
            result.bulletAlpha = 0.8;
            return result;
        }

        function getDataProviders(attributesArray) {
            var result = [];
            var numberOfObjects = getNumberOfValueObjects(attributesArray);
            for (var j = 0; j < numberOfObjects; j++) {
                var valuesObject = '{';
                for (var k = 1, lengthK = attributesArray.length; k <= lengthK; k++) {
                    if (attributesArray[k - 1].values[j] !== undefined) {
                        valuesObject = valuesObject + '"x' + k + '": ' + attributesArray[k - 1].values[j].x + ',';
                        valuesObject = valuesObject + '"y' + k + '": ' + attributesArray[k - 1].values[j].y + ',';
                        valuesObject = valuesObject + '"value' + k + '": ' + attributesArray[k - 1].values[j].value + ',';
                    }
                }
                valuesObject = valuesObject.slice(0, -1);
                valuesObject = valuesObject + '}';
                result.push(JSON.parse(valuesObject));
            }
            return result;
        }

        function getNumberOfValueObjects(attributesArray) {
            var numberOfObjects = 0;
            for (var i = 0, lengthI = attributesArray.length; i < lengthI; i++) {
                if (attributesArray[i].values.length > numberOfObjects) {
                    numberOfObjects = attributesArray[i].values.length;
                }
            }
            return numberOfObjects;
        }

        function getMinLabel(axe) {
            if (axe.minimal !== undefined) {
                return axe.minimal;
            }
            return Math.min.apply(Math, axe.labels.map(function(o) { return o[0]; }));
        }

        function getMaxLabel(axe) {
            if (axe.maximum !== undefined) {
                return axe.maximum;
            }
            return Math.max.apply(Math, axe.labels.map(function(o) { return o[0]; }));
        }

        function getStrictMinMax(axe) {
            if (axe.strictMinMax !== undefined) {
                return axe.strictMinMax;
            }
            return true;
        }

        function getLabelDescription(value, labels) {
            var labelsMap = new Map(labels);
            var text = labelsMap.get(value);
            if (text !== undefined) {
                return text;
            }
            return '';
        }

        function createChart(id, data, graphs, bottomAxe, leftAxe) {
            return AmCharts.makeChart('qabubblegraph', {
                'type': 'xy',
                'theme': 'light',
                'legend': {
                    'horizontalGap': 10,
                    'maxColumns': 1,
                    'position': 'right',
                    'markerType': 'circle'
                },
                'dataProvider': data,
                'valueAxes': [{
                    'position': 'bottom',
                    'title': bottomAxe.title,
                    'minimum': getMinLabel(bottomAxe),
                    'maximum': getMaxLabel(bottomAxe),
                    'strictMinMax': getStrictMinMax(bottomAxe),
                    'labelFunction': function (value) {
                        return getLabelDescription(value, bottomAxe.labels);
                    }
                }, {

                    'axisAlpha': 0,
                    'position': 'left',
                    'title': leftAxe.title,
                    'minimum': getMinLabel(leftAxe),
                    'maximum': getMaxLabel(leftAxe),
                    'strictMinMax': getStrictMinMax(leftAxe),
                    'labelFunction': function (value) {
                        return getLabelDescription(value, leftAxe.labels);
                    }
                }],
                'startDuration': 1.5,
                'graphs': graphs,
                'responsive': {
                    'enabled': true
                }

            });

        }

    }

})();
