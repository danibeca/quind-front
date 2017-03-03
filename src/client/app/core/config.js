(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    var config = {
        appErrorPrefix: '[Quind Error] ',
        appTitle: 'Quind'
    };

    core.value('config', config);

    core.config(configure);

    /* @ngInject */
    function configure($logProvider, $qProvider, routerHelperProvider, exceptionHandlerProvider, environmentConfig) {
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        $qProvider.errorOnUnhandledRejections(false);
        if (environmentConfig.env === 'dev') {
            exceptionHandlerProvider.configure(config.appErrorPrefix);
        }
        routerHelperProvider.configure({docTitle: config.appTitle + ': '});

    }

})();
