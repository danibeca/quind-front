/* jshint -W079, -W109, -W117*/
/*jshint unused:false, maxlen:false*/
/* jscs:disable */


var mockAppService = (function () {
    return {
        getApplications: getApplications,
        getApplicationsData: getApplicationsData,
        getIndicator: getIndicator,
        getGeneralIndicators: getGeneralIndicators,
        getIndicatorData: getIndicatorData
    };

    function getApplicationsData() {
        return [
            {'id': 5, 'name': 'Localizacion'}, {'id': 6, 'name': 'Recorridos'}, {
                'id': 7,
                'name': 'Servicios Comandos'
            }, {'id': 8, 'name': 'Sincronizador Maestro'}, {'id': 9, 'name': 'Contenedor Principal'}, {
                'id': 10,
                'name': 'Control Trafico Legacy'
            }, {'id': 11, 'name': 'Habitos de Conduccion'}]
            ;
    }

    function getApplications() {
        return {
            then: function () {
                return {};
            },
            catch: function () {
                return {};
            }
        };

    }

    function getIndicatorData() {
        return {"id": 1, "name": "Indicador de Calidad en el codigo", "value": 73};
    }

    function getIndicator() {
        var apps = {};
        return {
            then: function () {
                return apps;
            },
            catch: function () {
                return {};
            }
        };
    }

    function getGeneralIndicators() {
        var apps = {};
        return {
            then: function () {
                return apps;
            },
            catch: function () {
                return {};
            }
        };
    }

})();

