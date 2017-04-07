/**
 * @author Daniel Betancur <danibeca@okazo.co>
 * created on 03.30.2017
 */
/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('blocks.amcharts3')
        .factory('stockMultipleService', stockMultipleService);

    /* @ngInject */
    function stockMultipleService(layoutPaths) {
        var service = {
            transformData: transformData,
            getDataSets: getDataSets,
            getPanels: getPanels,
            getPeriodSelector: getPeriodSelector,
            getResponsive: getResponsive,
            getTranslations: getTranslations,
            createChart: createChart
        };

        return service;

        function transformData(ids, vars, labels, series, language) {
            var result = [];
            result.dataSets = getDataSets(ids, vars, labels, series);
            result.panels = getPanels(vars);
            result.translations = getTranslations(language);
            result.periodSelector = getPeriodSelector(result.translations);
            result.responsive = getResponsive();
            return result;
        }

        function getDataSets(ids, vars, labels, series) {
            var result = [];
            var numberOfcharts = 0;
            ids.forEach(function (id) {
                var chartData = [];
                numberOfcharts++;
                if (numberOfcharts > 1) {
                    chartData.compared = true;
                }
                chartData.title = labels[id].title;
                chartData.fieldMappings = [{
                    'fromField': vars[0],
                    'toField': vars[0]
                }];
                chartData.dataProvider = series[id];
                chartData.categoryField = vars[1];
                result.push(chartData);
            });

            return result;
        }

        function getPanels(vars) {

            return [{
                'showCategoryAxis': true,
                'title': '',
                'stockGraphs': [{
                    'id': 'g1',
                    'valueField': vars[0],
                    'comparable': true,
                    'compareField': vars[0],
                    'balloonText': '[[title]]:<b>[[value]]</b>',
                    'compareGraphBalloonText': '[[title]]:<b>[[value]]</b>'

                }],
                'stockLegend': {
                    'periodValueTextComparing': '[[value.close]]%',
                    'periodValueTextRegular': '[[value.close]]'
                },
                'recalculateToPercents': 'never'

            }];
        }

        function getPeriodSelector(translations) {
            return {
                'position': 'left',
                'fromText': translations.from,
                'toText': translations.to,
                'periods': [{
                    'period': 'MM',
                    'selected': true,
                    'count': 1,
                    'label': translations.oneMonth
                }, {
                    'period': 'YYYY',
                    'count': 1,
                    'label': translations.oneYear
                }, {
                    'period': 'YTD',
                    'label': translations.thisYear
                }, {
                    'period': 'MAX',
                    'label': translations.maximum
                }]
            };
        }

        function getResponsive() {
            return {
                'enabled': true,
                'rules': [
                    {
                        'id': 1,
                        'maxWidth': 314,
                        'overrides': {
                            'periodSelector': {
                                'enabled': false
                            },
                            'dataSetSelector': {
                                'enabled': false,
                            },
                            'chartCursorSettings': {
                                'valueBalloonsEnabled': false,
                                'valueLineEnabled': false,
                                'valueLineBalloonEnabled': false
                            },
                            'categoryAxesSettings': {
                                'minHorizontalGap': 30,
                                'fontSize': 8
                            },
                            'valueAxesSettings': {
                                'minVerticalGap': 10,
                                'fontSize': 8
                            }
                        }
                    },
                    {
                        'id': 2,
                        'minWidth': 314,
                        'maxWidth': 500,
                        'overrides': {
                            'periodSelector': {
                                'enabled': true
                            },
                            'dataSetSelector': {
                                'enabled': false,
                            },
                            'chartCursorSettings': {
                                'valueBalloonsEnabled': true,
                                'valueLineEnabled': false,
                                'valueLineBalloonEnabled': false
                            },
                            'categoryAxesSettings': {
                                'minHorizontalGap': 30,
                                'fontSize': 8
                            },
                            'valueAxesSettings': {
                                'minVerticalGap': 10,
                                'fontSize': 8
                            }
                        }
                    }
                ]
            };
        }

        function getTranslations(lang) {
            var result = [];
            if (lang === 'es') {
                result = {
                    'oneMonth': 'Un mes',
                    'oneYear': 'Un año',
                    'thisYear': new Date().getFullYear(),
                    'maximum': 'MAX',
                    'from': 'Desde',
                    'to': 'Hasta',
                    'compare': 'Comparar con:',
                    'select': 'Selección:',
                    'language': 'es'
                };
            } else {
                result = {
                    'oneMonth': '1 month',
                    'oneYear': '1 year',
                    'thisYear': 'YTD',
                    'maximum': 'MAX',
                    'from': 'From',
                    'to': 'to',
                    'compare': 'Compare to:',
                    'select': 'Select:',
                    'language': 'en'
                };
            }
            return result;
        }

        function createChart(id, data) {

            return AmCharts.makeChart(id, {
                'type': 'stock',
                'theme': 'light',
                'dataSets': data.dataSets,
                'processDelay': 200,

                'panels': data.panels,
                'dataDateFormat': 'DD MM YYYY',
                'chartScrollbarSettings': {
                    'graph': 'g1'
                },

                'valueAxesSettings': {
                    'minimum': 0,
                    'maximum': 100
                },

                'chartCursorSettings': {
                    'valueBalloonsEnabled': true,
                    'fullWidth': true,
                    'cursorAlpha': 0.1,
                    'cursorColor': '#2693FF',
                    'valueLineBalloonEnabled': false,
                    'valueLineEnabled': false,
                    'valueLineAlpha': 0.5
                },

                'periodSelector': data.periodSelector,

                'dataSetSelector': {
                    'position': 'left',
                    'compareText': data.translations.compare,
                    'selectText': data.translations.select
                },
                'responsive': data.responsive,

                'language': data.translations.language,

                'pathToImages': layoutPaths.images.amChart,

                'export': {
                    'enabled': false
                }

            });

        }

    }

})();
