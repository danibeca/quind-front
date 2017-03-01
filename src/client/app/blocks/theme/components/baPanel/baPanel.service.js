/**
 * @author v.lugovsky
 * created on 23.12.2015
 */
(function () {
    'use strict';

    angular.module('blocks.theme')
        .factory('baPanel', baPanel);

    /* @ngInject */
    function baPanel() {

        /** Base baPanel directive */
        return {
            restrict: 'A',
            transclude: true,
            template: function (elem, attrs) {
                var res = '<div class="panel-body" ng-transclude></div>';
                if (attrs.baPanelTitle) {
                    var titleTpl = '<div class="panel-heading clearfix"><h3 class="panel-title">';
                    titleTpl += attrs.baPanelTitle;
                    if (attrs.baPanelTitleExt !== undefined) {
                        titleTpl += '  <span class="panel-heading-title-ext">' + attrs.baPanelTitleExt + '</span>';
                    }
                    titleTpl += '</h3></div>';
                    res = titleTpl + res; // title should be before
                }

                return res;
            }
        };
    }

})();
