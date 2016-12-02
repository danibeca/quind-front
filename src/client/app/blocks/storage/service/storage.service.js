(function() {
    'use strict';

    angular
        .module('blocks.storage')
        .factory('storage', storage);

    /* @ngInject */
    function storage() {
        var service = {
            clear: clear,
            getJsonObject: getJsonObject,
            setJsonObject: setJsonObject,
        };

        return service;

        function clear() {
            window.localStorage.clear();
        }

        function getJsonObject(name) {
            return JSON.parse(window.localStorage.getItem(name));
        }

        function setJsonObject(name, object) {
            window.localStorage.setItem(name, JSON.stringify(object));
        }
    }
})();
