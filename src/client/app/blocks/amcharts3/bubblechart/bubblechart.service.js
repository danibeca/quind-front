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
        .factory('bubbleChartService', bubbleChartService);

    /* @ngInject */
    function bubbleChartService() {
        var service = {
            transformData: transformData,
            createChart: createChart
        };

        return service;

        function transformData(attributesArray, config) {
            var result = {};
            result.graphs = [];
            attributesArray.forEach(function (item, index) {
                result.graphs.push(buildChartProvider(item.name, item.balloonText, index + 1, config));
            });
            result.data = getDataProviders(attributesArray);
            result.bottomAxe = config.bottomAxe;
            result.leftAxe = config.leftAxe;
            return result;
        }

        function buildChartProvider(attributeTitle, attributeBalloonText, attributeIndex, config) {
            var result = {};
            result.title = attributeTitle;
            result.balloonText = attributeBalloonText;
            result.valueField = 'value' + attributeIndex;
            result.xField = 'x' + attributeIndex;
            result.yField = 'y' + attributeIndex;
            result.bullet = getBullet(config);
            result.lineAlpha = getLineAlpha(config);
            result.fillAlphas = getFillAlphas(config);
            result.maxBulletSize = getMaxBulletSize(config);
            result.minBulletSize = getMinBulletSize(config);
            result.bulletBorderAlpha = getBulletBorderAlpha(config);
            result.bulletBorderThickness = getBulletBorderThickness(config);
            result.bulletAlpha = getBulletAlpha(config);
            return result;
        }

        function getBullet(config) {
            if (config.bullet !== undefined && config.bullet !== '') {
                return config.bullet;
            } else {
                return 'circle';
            }
        }

        function getLineAlpha(config) {
            if (config.lineAlpha !== undefined && config.lineAlpha !== '') {
                return config.lineAlpha;
            } else {
                return 0;
            }
        }

        function getFillAlphas(config) {
            if (config.fillAlphas !== undefined && config.fillAlphas !== '') {
                return config.fillAlphas;
            } else {
                return 0;
            }
        }

        function getMaxBulletSize(config) {
            if (config.maxBulletSize !== undefined && config.maxBulletSize !== '') {
                return config.maxBulletSize;
            } else {
                return 80;
            }
        }

        function getMinBulletSize(config) {
            if (config.minBulletSize !== undefined && config.minBulletSize !== '') {
                return config.minBulletSize;
            } else {
                return 15;
            }
        }

        function getBulletBorderAlpha(config) {
            if (config.bulletBorderAlpha !== undefined && config.bulletBorderAlpha !== '') {
                return config.bulletBorderAlpha;
            } else {
                return 1;
            }
        }

        function getBulletBorderThickness(config) {
            if (config.bulletBorderThickness !== undefined && config.bulletBorderThickness !== '') {
                return config.bulletBorderThickness;
            } else {
                return 2;
            }
        }

        function getBulletAlpha(config) {
            if (config.bulletAlpha !== undefined && config.bulletAlpha !== '') {
                return config.bulletAlpha;
            } else {
                return 0.8;
            }
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
            return Math.min.apply(Math, axe.labels.map(function (o) {
                return o[0];
            }));
        }

        function getMaxLabel(axe) {
            if (axe.maximum !== undefined) {
                return axe.maximum;
            }
            return Math.max.apply(Math, axe.labels.map(function (o) {
                return o[0];
            }));
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

        function createChart(id, providers) {
            return AmCharts.makeChart(id, {
                'type': 'xy',
                'theme': 'light',
                'legend': {
                    'horizontalGap': 10,
                    'maxColumns': 1,
                    'position': 'right',
                    'markerType': 'circle'
                },
                'dataProvider': providers.data,
                'valueAxes': [{
                    'position': 'bottom',
                    'title': providers.bottomAxe.title,
                    'minimum': getMinLabel(providers.bottomAxe),
                    'maximum': getMaxLabel(providers.bottomAxe),
                    'strictMinMax': getStrictMinMax(providers.bottomAxe),
                    'labelFunction': function (value) {
                        return getLabelDescription(value, providers.bottomAxe.labels);
                    }
                }, {

                    'axisAlpha': 0,
                    'position': 'left',
                    'title': providers.leftAxe.title,
                    'minimum': getMinLabel(providers.leftAxe),
                    'maximum': getMaxLabel(providers.leftAxe),
                    'strictMinMax': getStrictMinMax(providers.leftAxe),
                    'labelFunction': function (value) {
                        return getLabelDescription(value, providers.leftAxe.labels);
                    }
                }],
                'startDuration': 1.5,
                'graphs': providers.graphs,
                'responsive': {
                    'enabled': true
                }

            });

        }

    }

})();
