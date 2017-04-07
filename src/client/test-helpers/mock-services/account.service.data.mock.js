/* jshint -W079, -W109, -W117*/
/*jshint unused:false, maxlen:false*/
/* jscs:disable */


var accountServiceDataMock = (function () {
    return {
        getIndicator: getIndicator,
        getIndicators: getIndicators,
        getIndicatorsExceeded: getIndicatorsExceeded,
        getIndicatorSeries: getIndicatorSeries
    };

    function getIndicator() {
        return {"id": 1, "name": "Indicador de Calidad en el codigo", "code": "acc_general_code_health", "value": 73};
    }

    function getIndicators() {
        return [{
            "id": 1,
            "name": "Salud del Codigo",
            "code": "acc_general_code_health",
            "value": "93.865"
        }, {
            "id": 2,
            "name": "Confiabilidad",
            "code": "acc_general_reliability",
            "value": "65.854"
        }, {
            "id": 3,
            "name": "Potencial de Eficiencia",
            "code": "acc_general_potential_efficiency",
            "value": "86.366"
        }];

    }

    function getIndicatorsExceeded() {
        return [{
            "id": 1,
            "name": "Salud del Codigo",
            "code": "acc_general_code_health",
            "value": "93.865"
        }, {
            "id": 2,
            "name": "Confiabilidad",
            "code": "acc_general_reliability",
            "value": "65.854"
        }, {
            "id": 3,
            "name": "Potencial de Eficiencia",
            "code": "acc_general_potential_efficiency",
            "value": "86.366"
        }, {
            "id": 4,
            "name": "Potencial de Eficiencia",
            "code": "acc_general_potential_efficiency",
            "value": "90"
        }, {
            "id": 5,
            "name": "Potencial de Eficiencia",
            "code": "acc_general_potential_efficiency",
            "value": "10"
        }, {
            "id": 6,
            "name": "Potencial de Eficiencia",
            "code": "acc_general_potential_efficiency",
            "value": "12"
        }, {
            "id": 7,
            "name": "Potencial de Eficiencia",
            "code": "acc_general_potential_efficiency",
            "value": "20"
        }

        ];
    }

    function getIndicatorSeries() {
        return [{
            "date": "16-03-2017",
            "value": 86.366
        }, {
            "date": "18-03-2017",
            "value": 95.910
        }, {
            "date": "19-03-2017",
            "value": 97.955
        }, {
            "date": "20-03-2017",
            "value": 97.955
        }, {
            "date": "22-03-2017",
            "value": 92.459
        }];
    }





    function stringify2(obj) {
        var result = '{';

        var objKeys = Object.keys(obj);
        for (var i = 0; i < objKeys.length; i++) {
            var elem = obj[objKeys[i]];
            var colon = '';
            if (i < objKeys.length - 1) {
                colon = ',';
            }
            if (typeof elem === 'object') {

                if (Array.isArray(elem)) {
                    result += '"' + objKeys[i] + '":' + '[' + stringify2(elem) + ']' + colon;
                } else {
                    result += '"' + objKeys[i] + '":' + stringify2(elem) + colon;
                }

            } else {
                result += '"' + objKeys[i] + '":"' + elem + '"' + colon;
            }
        }

        return result + '}';
    }


})
();
