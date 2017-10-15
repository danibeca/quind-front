(function () {
    'use strict';

    angular
        .module('blocks.storage')
        .factory('storageService', storageService);

    /* @ngInject */
    function storageService() {
        var service = {
            clear: clear,
            getJsonObject: getJsonObject,
            setJsonObject: setJsonObject,
            get: get,
            set: set,
            remove:remove,
            has: has

        };

        return service;

        function clear() {
            window.localStorage.clear();
        }

        function has(name) {
            if(get(name) === null){
                return false;
            }
            return false;
        }

        function getJsonObject(name) {
                return JSON.parse(get(name));
        }

        function setJsonObject(name, object) {
            set(name, JSON.stringify(object));
        }

        function get(name) {
            return window.localStorage.getItem(name);
        }

        function set(name, variable) {
            window.localStorage.setItem(name, variable);
        }

        function remove(name) {
            window.localStorage.removeItem(name);
        }

    }
})();
