/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    /* @ngInject */
    function DashboardController(croot, userService, accountService, componentService, storageService, $timeout) {
        var vm = this;
        vm.user = userService.getUser();
        vm.chartId = 'dashChart1';
        vm.lang = storageService.get('lang');
        vm.indIds = '44,52,57';
        vm.vars = {
            0: 'value',
            1: 'date'
        };

        var ids = [];
        var labels = [];
        var dSeries = [];

        activate();

        function activate() {

            componentService.getInfo(croot.id)
                .then(successInfo)
                .catch(failInfo);

            function successInfo(info) {
                vm.info = info;

            }

            function failInfo(error) {
                vm.errorInfo = error;
            }

            componentService.getQA(croot.id)
                .then(successQA)
                .catch(failQA);

            componentService.getIndicators(croot.id, vm.indIds)
                .then(success)
                .catch(fail);


            function success(indicators) {
                vm.data = indicators;
                var missing = indicators.length;
                componentService.getIndicatorSeries(croot.id, vm.indIds)
                    .then(successSeries)

                function successSeries(indi) {
                    indicators.forEach(function (name) {
                        indi.forEach(function (indicator) {
                            if (indicator[name.id] !== undefined) {
                                missing--;
                                ids.push(name.id);
                                labels[name.id] = {
                                    'title': name.name
                                };
                                dSeries[name.id] = indicator[name.id];

                                if (missing === 0) {
                                    createRunChart();
                                }
                            }
                        });
                    });
                }

                function createRunChart() {
                    vm.ids = ids;
                    vm.labels = labels;
                    vm.series = dSeries;

                }
            }

            function successQA(qa) {
                vm.qa = qa;
                vm.qaGraphsProvider = JSON.parse(JSON.stringify(vm.qa[0]))
                var delay = 1000;
                $timeout(function () {
                    bubbles(vm.qa[1], vm.qa[0]);
                }, delay);
            }

            function fail(error) {
                vm.error = true;
                vm.seriesError = true;
                vm.msgError = error['msgCode'];
            }


            function failQA(error) {
                vm.errorQA = error;
            }

            function bubbles(data, graphs) {
                var labelsArray = [[0, ''], [1, 'Muy bajo'], [2, 'Bajo'], [3, 'Medio'], [4, 'Alto'], [5, 'Muy alto']];
                vm.bottomAxe = {};
                vm.bottomAxe.title = 'Esfuerzo';
                vm.bottomAxe.labels = labelsArray;
                vm.leftAxe = {};
                vm.leftAxe.title = 'Criticidad';
                vm.leftAxe.labels = labelsArray ;
                vm.qaData = JSON.parse('[\n' +
                    '  {\n' +
                    '    "name": "Seguridad",\n' +
                    '    "balloonText":"Criticidad:<b>[[y]]<\\/b> Esfuerzo:<b>[[x]]<\\/b><br>Cantidad:<b>[[value]]<\\/b>",\n' +
                    '    "values": [\n' +
                    '      {\n' +
                    '        "x":"1",\n' +
                    '        "y":"5",\n' +
                    '        "value":"2"\n' +
                    '      },\n' +
                    '      {\n' +
                    '        "x":"1",\n' +
                    '        "y":"4",\n' +
                    '        "value":"5"\n' +
                    '      },\n' +
                    '      {\n' +
                    '        "x":"1",\n' +
                    '        "y":"3",\n' +
                    '        "value":"77"\n' +
                    '      }\n' +
                    '    ]\n' +
                    '  },\n' +
                    '  {\n' +
                    '    "name": "Mantenibilidad",\n' +
                    '    "balloonText":"Criticidad:<b>[[y]]<\\/b> Esfuerzo:<b>[[x]]<\\/b><br>Cantidad:<b>[[value]]<\\/b>",\n' +
                    '    "values": [\n' +
                    '      {\n' +
                    '        "x":"1",\n' +
                    '        "y":"4",\n' +
                    '        "value":"11"\n' +
                    '      },\n' +
                    '      {\n' +
                    '        "x":"1",\n' +
                    '        "y":"3",\n' +
                    '        "value":"1699"\n' +
                    '      },\n' +
                    '      {\n' +
                    '        "x":"2",\n' +
                    '        "y":"3",\n' +
                    '        "value":"51"\n' +
                    '      },\n' +
                    '      {\n' +
                    '        "x":"3",\n' +
                    '        "y":"3",\n' +
                    '        "value":"1"\n' +
                    '      },\n' +
                    '      {\n' +
                    '        "x":"5",\n' +
                    '        "y":"3",\n' +
                    '        "value":"2"\n' +
                    '      },\n' +
                    '      {\n' +
                    '        "x":"1",\n' +
                    '        "y":"2",\n' +
                    '        "value":"76"\n' +
                    '      }\n' +
                    '    ]\n' +
                    '  },\n' +
                    '  {\n' +
                    '    "name": "Usabilidad",\n' +
                    '    "balloonText":"Criticidad:<b>[[y]]<\\/b> Esfuerzo:<b>[[x]]<\\/b><br>Cantidad:<b>[[value]]<\\/b>",\n' +
                    '    "values": [\n' +
                    '      {\n' +
                    '        "x":"1",\n' +
                    '        "y":"3",\n' +
                    '        "value":"5"\n' +
                    '      },\n' +
                    '      {\n' +
                    '        "x":"1",\n' +
                    '        "y":"1",\n' +
                    '        "value":"53"\n' +
                    '      }\n' +
                    '    ]\n' +
                    '  },\n' +
                    '  {\n' +
                    '    "name": "Confiabilidad",\n' +
                    '    "balloonText":"Criticidad:<b>[[y]]<\\/b> Esfuerzo:<b>[[x]]<\\/b><br>Cantidad:<b>[[value]]<\\/b>",\n' +
                    '    "values": [\n' +
                    '      {\n' +
                    '        "x":"2",\n' +
                    '        "y":"3",\n' +
                    '        "value":"1"\n' +
                    '      },\n' +
                    '      {\n' +
                    '        "x":"1",\n' +
                    '        "y":"3",\n' +
                    '        "value":"9"\n' +
                    '      }\n' +
                    '    ]\n' +
                    '  }\n' +
                    ']\n');

                AmCharts.makeChart('qagraph', {
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
                        'title': 'Esfuerzo',
                        'minimum': 0,
                        'maximum': 5,
                        'strictMinMax': true,
                        'labelFunction': function (value) {
                            if (value === 1) {
                                return 'Muy bajo';
                            }
                            if (value === 2) {
                                return 'Bajo';
                            }
                            if (value === 3) {
                                return 'Medio';
                            }
                            if (value === 4) {
                                return 'Alto';
                            }

                            if (value === 5) {
                                return 'Muy alto';
                            }
                            return '';
                        }

                    }, {

                        'axisAlpha': 0,
                        'position': 'left',
                        'title': 'Criticidad',
                        'minimum': 0,
                        'maximum': 5,
                        'strictMinMax': true,
                        'minMaxMultiplier': 1.5,
                        'labelFunction': function (value) {
                            if (value === 1) {
                                return 'Muy bajo';
                            }
                            if (value === 2) {
                                return 'Bajo';
                            }
                            if (value === 3) {
                                return 'Medio';
                            }
                            if (value === 4) {
                                return 'Alto';
                            }

                            if (value === 5) {
                                return 'Muy alto';
                            }
                            return '';
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
    }
})();
