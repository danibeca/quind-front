(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    /* @ngInject */
    function DashboardController(user, accountService, Restangular, storage) {
        var vm = this;
        vm.user = user.getUser();
        vm.chartId = 'dashChart1';
        vm.lang = storage.get('lang');
        vm.vars = {
            0: 'value',
            1: 'date'
        };

        var ids = [];
        var labels = [];
        var dSeries = [];

        activate();

        function activate() {



            accountService.getIndicators(vm.user.accountId)
                .then(success)
                .catch(fail);

            function success(indicators) {
                vm.data = indicators;
                var missing = indicators.length;
                indicators.forEach(function (indicator) {
                    accountService.getIndicatorSeries(vm.user.accountId, indicator.id)
                        .then(successSeries)
                        .catch(failSeries);

                    function successSeries(series) {
                        missing--;
                        ids.push(indicator.id);
                        labels[indicator.id] = {
                            'title': indicator.name
                        };
                        dSeries[indicator.id] = series;

                        if (missing === 0) {
                            createRunChart();
                        }
                    }

                    function failSeries(error) {
                        vm.seriesError = true;
                        vm.msgError = error['msgCode'];
                    }
                });


                function createRunChart() {
                    vm.ids = ids;
                    vm.labels = labels;
                    vm.series = dSeries;
                    bubbles();
                }
            }

            function fail(error) {
                vm.error = true;
                vm.seriesError = true;
                vm.msgError = error['msgCode'];
            }

            function bubbles() {

                AmCharts.makeChart("gato", {
                    "type": "xy",
                    "theme": "light",
                    "legend": {
                        "horizontalGap": 10,
                        "maxColumns": 1,
                        "position": "right",
                        "useGraphSettings": true,
                        "markerSize": 10,
                        "marginTop": 20
                    },
                    "dataProvider": [{
                        "y": 5,
                        "x": 60,
                        "value": 59,
                        "y2": 3,
                        "x2": 0,
                        "value2": 44,
                        "y3": 1,
                        "x3": 2,
                        "value3": 580,
                        "y4": 3,
                        "x4": 20,
                        "value4": 20
                    }, {
                        "y": 5,
                        "x": 3,
                        "value": 50,
                        "y2": 2,
                        "x2": 8,
                        "value2": 12
                    }, {
                        "y": 4,
                        "x": 3,
                        "value": 19,
                        "y2": 4,
                        "x2": 6,
                        "value2": 35
                    }, {
                        "y": 1,
                        "x": 5,
                        "value": 65,
                        "y2": 5,
                        "x2": 6,
                        "value2": 168
                    }, {
                        "y": 4,
                        "x": 4,
                        "value": 92,
                        "y2": 4,
                        "x2": 8,
                        "value2": 102
                    }, {
                        "y": 5,
                        "x": 1,
                        "value": 8,
                        "y2": 2,
                        "x2": 3,
                        "value2": 41
                    }, {
                        "y": 1,
                        "x": 6,
                        "value": 35,
                        "y2": 2,
                        "x2": 1,
                        "value2": 16
                    }],
                    "valueAxes": [{
                        "position": "bottom",
                        "axisAlpha": 0,
                        "title": "Esfuerzo"
                    }, {

                        "axisAlpha": 0,
                        "position": "left",
                        "title": "Impacto"
                    }],
                    "startDuration": 1.5,
                    "graphs": [{
                        "balloonText": "x:<b>[[x]]</b> y:<b>[[y]]</b><br>value:<b>[[value]]</b>",
                        "bullet": "bubble",
                        "lineAlpha": 0,
                        "valueField": "value",
                        "xField": "x",
                        "yField": "y",
                        "fillAlphas": 0,
                        "bulletBorderAlpha": 0.2,
                        "maxBulletSize": 80,
                        "title": "Mantenibilidad"


                    }, {
                        "balloonText": "x:<b>[[x]]</b> y:<b>[[y]]</b><br>value:<b>[[value]]</b>",
                        "bullet": "bubble",
                        "lineAlpha": 0,
                        "valueField": "value2",
                        "xField": "x2",
                        "yField": "y2",
                        "fillAlphas": 0,
                        "bulletBorderAlpha": 0.2,
                        "maxBulletSize": 80,
                        "title": "Seguridad"

                    }, {
                        "balloonText": "x:<b>[[x]]</b> y:<b>[[y]]</b><br>value:<b>[[value]]</b>",
                        "bullet": "bubble",
                        "lineAlpha": 0,
                        "valueField": "value3",
                        "xField": "x3",
                        "yField": "y3",
                        "fillAlphas": 0,
                        "bulletBorderAlpha": 0.1,
                        "maxBulletSize": 80,
                        "bulletBorderColor": "#CC0000",
                        "title": "Portabilidad"

                    }, {
                        "balloonText": "x:<b>[[x]]</b> y:<b>[[y]]</b><br>value:<b>[[value]]</b>",
                        "bullet": "bubble",
                        "lineAlpha": 0,
                        "valueField": "value4",
                        "xField": "x4",
                        "yField": "y4",
                        "fillAlphas": 0,
                        "bulletBorderAlpha": 0.1,
                        "maxBulletSize": 80,
                        "bulletBorderColor": "#CC0000",
                        "title": "Facilidad de pruebas"

                    }],
                    "responsive": {
                        "enabled": true
                    }

                });
            }
        }
    }
})();
