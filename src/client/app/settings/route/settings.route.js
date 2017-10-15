(function () {
    'use strict';

    angular
        .module('app.settings')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }


    function getStates() {

        return [
            {
                state: 'settings',
                config: {
                    url: '/settings',
                    templateUrl: 'app/settings/template/settings.html',
                    controller: 'SettingsController',
                    controllerAs: 'vm',
                    title: 'SETTINGS_TITLE',
                    resolve: {
                        translations: function (translateHelper) {
                            return translateHelper.addParts('settings');
                        },
                        croot: function (storageService, userService, componentService) {
                            if (!storageService.has('croot')) {
                                return componentService.getRoot(userService.getUser().id)
                                    .then(success)

                            } else {
                                return storageService.getJsonObject('croot');
                            }

                            function success(resp) {
                                storageService.setJsonObject('croot', resp);
                                return resp;
                            }
                        }
                    }
                }
            }
        ];
    }
})();

