/**
 * @author Daniel Betancur <danibeca@okazo.co>
 * created on 03.29.2017
 */
/* jshint -W117, -W030*/
/* jscs:disable */
describe('Multiple Data Chart Directive', function () {

    var directiveElem, scope;
    beforeEach(function () {
        module('blocks.amcharts3', 'app.core', bard.fakeToastr);
        bard.inject('$compile', '$rootScope', '$window', '$timeout');
        scope = $rootScope.$new();
    });

    beforeEach(function () {
        directiveElem = getCompiledElement();
    });

    it('should have a DIV defined with id', function () {
        var element = angular.element(directiveElem.find('div')[6]);
        var controller = directiveElem.controller('stockMultipleChart');

        expect(element.attr('id')).to.equal(controller.id);
    });

    it('shouldnt create the chart if ids is empty or undefined', function () {
        var sc = directiveElem.isolateScope();
        sc.ids = '';
        sc.vars = [1];
        sc.labels = [1];
        sc.series = [1];
        sc.$digest();
        var controller = directiveElem.controller('stockMultipleChart');

        expect(controller.chart).to.be.undefined;
        expect(controller.ids).to.be.undefined;

    });


    it('shouldnt create the chart if series is empty or undefined', function () {
        var sc = directiveElem.isolateScope();
        sc.ids = [1];
        sc.vars = [1];
        sc.labels = [1];
        sc.series = '';
        sc.$digest();
        var controller = directiveElem.controller('stockMultipleChart');

        expect(controller.chart).to.be.undefined;
        expect(controller.series).to.be.undefined;

    });

    it('shouldnt create the chart if vars is empty or undefined', function () {
        var sc = directiveElem.isolateScope();
        sc.vars = '';
        sc.ids = [1];
        sc.labels = [1];
        sc.series = [1];
        sc.$digest();
        var controller = directiveElem.controller('stockMultipleChart');

        expect(controller.chart).to.be.undefined;
        expect(controller.vars).to.be.undefined;

    });

    it('shouldnt create the chart if labels is empty or undefined', function () {
        var sc = directiveElem.isolateScope();
        sc.labels = '';
        sc.ids = [1];
        sc.vars = [1];
        sc.series = [1];
        sc.$digest();
        var controller = directiveElem.controller('stockMultipleChart');

        expect(controller.chart).to.be.undefined;
        expect(controller.labels).to.be.undefined;

    });

    it('shouldnt create the chart if labels is empty or undefined', function () {
        var sc = directiveElem.isolateScope();
        sc.labels = [1];
        sc.ids = [1];
        sc.vars = [1];
        sc.series = [1];
        sc.lang = '';
        sc.$digest();
        var controller = directiveElem.controller('stockMultipleChart');

        expect(controller.chart).to.be.undefined;
        expect(controller.lang).to.be.undefined;

    });


    function getCompiledElement() {
        var element = angular.element('<stock-multiple-chart></stock-multiple-chart>');
        var compiledElement = $compile(element)(scope);
        scope.$digest();
        return compiledElement;
    }

});
