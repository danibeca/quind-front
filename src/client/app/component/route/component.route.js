(function () {
    'use strict';

    angular
        .module('app.component')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {

        return [
            {
                state: 'component',
                config: {
                    url: '/component/{componentId}',
                    templateUrl: 'app/component/template/component.html',
                    controller: 'ComponentController',
                    controllerAs: 'vm',
                    title: 'COMPONENT_TITLE',
                    params: {
                        newPreviousRoute: null,
                        isComponent: false,
                        previousComponentId: null,
                        oldPreviousRoute: null
                    },
                    resolve: {
                        translations: function (translateHelper) {
                            return translateHelper.addParts('general');
                        }
                    }
                }
            },
        ];
    }
})();

