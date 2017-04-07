/**
 * @author Daniel Betancur <danibeca@okazo.co>
 * created on 02.22.2017
 */
/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('blocks.amcharts3')
        .factory('gaugeService', gaugeService);

    /* @ngInject */
    function gaugeService() {
        var itemsLimit = 5;
        var service = {
            transformData: transformData,
            getGauge: getGauge,
            getBands: getBands,
            getLabel: getLabel,
            getColor: getColor,
            addResponsiveLabel: addResponsiveLabel,
            getResponsiveBase: getResponsiveBase,
            shrinkText: shrinkText
        };

        return service;


        function getGauge(id, data) {
            return AmCharts.makeChart(id, {
                'type': 'gauge',
                'theme': 'light',
                'axes': [{
                    'axisAlpha': 0,
                    'tickAlpha': 0,
                    'labelsEnabled': false,
                    'startValue': 0,
                    'endValue': 100,
                    'startAngle': 0,
                    'endAngle': 270,
                    'bands': data.bands
                }],
                'allLabels': data.labels,
                'responsive': {
                    'enabled': true,
                    'rules': data.responsiveRules
                },
                'export': {
                    'enabled': false
                }
            });

        }

        function transformData(data) {
            var result = [];
            var bands = [];
            var labels = [];
            var responsiveRules = [];
            var numberOfElements = 0;
            var radiusReference = 100;
            var innerRadiusReference = 85;
            var positionYReference = 5;
            responsiveRules = getResponsiveBase();
            data.forEach(function (elem) {
                numberOfElements++;
                if (numberOfElements <= itemsLimit) {
                    var color = getColor(elem.value);
                    bands = bands.concat(getBands(elem.value, color, radiusReference, innerRadiusReference));
                    labels.push(getLabel(elem.name, positionYReference, 15, false, '#000'));
                    responsiveRules = addResponsiveLabel(responsiveRules, elem.name);
                    radiusReference = radiusReference - 20;
                    innerRadiusReference = innerRadiusReference - 20;
                    positionYReference = positionYReference + 9;
                }
            });
            result.bands = bands;
            result.labels = labels;
            result.responsiveRules = responsiveRules.setOfRules;
            return result;
        }

        function getBands(percentage, color, radiusReference, innerRadius) {
            return [{
                'color': '#EEE',
                'startValue': 0,
                'endValue': 100,
                'radius': radiusReference + '%',
                'innerRadius': innerRadius + '%'
            }, {
                'color': color,
                'startValue': 0,
                'endValue': percentage,
                'radius': radiusReference + '%',
                'innerRadius': innerRadius + '%',
                'balloonText': percentage + '%'
            }];
        }

        function getLabel(text, positionY, size, isbold, color) {
            return {
                'text': text,
                'x': '49%',
                'y': positionY + '%',
                'size': size,
                'bold': isbold,
                'color': color,
                'align': 'right'
            };
        }

        function getColor(percentage) {
            var color = '#ED2E08'; //red
            if (percentage >= 80) {
                color = '#5EBE01'; //green
            } else if (percentage <= 79 && percentage >= 51) {
                color = '#FFFF4D';//yellow
            }
            else if (percentage <= 50 && percentage >= 39) {
                color = '#FE7903';//orange
            }
            return color;
        }

        function addResponsiveLabel(responsiveData, text) {
            var result = responsiveData;
            var newRules = [];

            result.setOfRules.forEach(function (rule) {
                var ruleId = rule.id;
                var params = result.ruleParams[ruleId];
                var newRefPositionY = params.referencePositionY + params.distancePositionY;
                var newText = shrinkText(text);
                rule.overrides.allLabels.push(
                    getLabel(newText, newRefPositionY, params.size, params.isBold, params.color)
                );
                result.ruleParams[ruleId].referencePositionY = newRefPositionY;
                newRules.push(rule);
            });

            result.setOfRules = newRules;

            return result;

        }

        function getResponsiveBase() {
            var responsive = [];
            responsive.setOfRules = [
                {
                    'id': 1,
                    'maxWidth': 214,
                    'overrides': {
                        'allLabels': []
                    }
                },
                {
                    'id': 2,
                    'minWidth': 215,
                    'maxWidth': 245,
                    'overrides': {
                        'allLabels': []
                    }
                },
                {
                    'id': 3,
                    'minWidth': 246,
                    'maxWidth': 268,
                    'overrides': {
                        'allLabels': []
                    }
                },
                {
                    'id': 4,
                    'minWidth': 269,
                    'maxWidth': 326,
                    'overrides': {
                        'allLabels': []
                    }
                }
            ];
            responsive.ruleParams = [];
            responsive.ruleParams[1] = {
                'size': 10,
                'referencePositionY': 16,
                'distancePositionY': 5,
                'isBold': true,
                'color': '#000'
            };
            responsive.ruleParams[2] = {
                'size': 12,
                'referencePositionY': 10,
                'distancePositionY': 7,
                'isBold': true,
                'color': '#000'
            };

            responsive.ruleParams[3] = {
                'size': 13,
                'referencePositionY': 6,
                'distancePositionY': 7,
                'isBold': true,
                'color': '#000'
            };

            responsive.ruleParams[4] = {
                'size': 14,
                'referencePositionY': 1,
                'distancePositionY': 8,
                'isBold': true,
                'color': '#000'
            };

            return responsive;
        }

        function shrinkText(text) {
            var result = text;
            if (text.length >= 18) {
                var resultArray = text.split(' ');
                resultArray[0] = resultArray[0].substring(0, 3) + '.';
                result = '';
                resultArray.forEach(function (word) {
                    result = result + word + ' ';
                });
                result = result.substring(0, result.length - 1);
            }
            return result;
        }
    }

})();
