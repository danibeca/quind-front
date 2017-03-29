/* jshint -W079, -W109, -W117*/
/*jshint unused:false, maxlen:false*/
/* jscs:disable */


var accountServiceHtttpMock = (function () {
    return {
        getIndicator: getIndicator,
        getIndicators: getIndicators,
        getError: getError,
    };

    function getIndicator() {
        return {
            "data": {
                "id": 1,
                "name": "Salud del Codigo",
                "code": "acc_general_code_health",
                "value": 93.865030674847
            }
        };
    }

    function getIndicators() {
        return {
            "data": [{
                'id': 1,
                'name': 'Salud del Codigo',
                'code': 'acc_general_code_health',
                'value': '93.865'
            }, {
                'id': 2,
                'name': 'Confiabilidad',
                'code': 'acc_general_reliability',
                'value': '65.854'
            }, {
                'id': 3,
                'name': 'Potencial de Eficiencia',
                'code': 'acc_general_potential_efficiency',
                'value': '86.366'
            }]
        };
    }

    function getError() {
        return function () {
            return [500, '{"error":{"message":"An error has occurred","statusCode":500}}'];
        };

    }


})();