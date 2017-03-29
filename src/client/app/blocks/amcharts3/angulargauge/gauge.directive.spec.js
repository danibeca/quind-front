/**
 * @author danibeca
 * created on 02.22.2017
 */
/* jshint -W117, -W030*/
/* jscs:disable */
describe('Gauge Directive', function () {

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
        expect(element.attr('id')).to.equal('');
    });

    it('shoudl change ctrl.id and div id when scope.chartid  change', function () {
        var sc = directiveElem.isolateScope();
        sc.chartid = '2032';
        sc.$digest();
        var controller = directiveElem.controller('gaugeChart');

        var element = angular.element(directiveElem.find('div')[6]);

        expect(element.attr('id')).to.equal(sc.chartid);
        expect(controller.chart).to.be.undefined;
        expect(controller.id).to.equal(sc.chartid);
    });

    it('shouldnt create the graph if data is empty', function () {
        var sc = directiveElem.isolateScope();
        sc.chartid = '2032';
        sc.$digest();
        sc.data = '';
        sc.$digest();

        var controller = directiveElem.controller('gaugeChart');
        expect(controller.chart).to.be.undefined;
    });

    it('should create guage graph when scope.data changes', function (done) {
        var sc = directiveElem.isolateScope();
        sc.chartid = '2032';
        sc.$digest();
        sc.data = JSON.stringify(accountServiceDataMock.getIndicators());
        sc.$digest();

        var controller = directiveElem.controller('gaugeChart');
        $timeout(function () {
            expect(controller.chart).to.not.be.undefined;
            expect(controller.chart.cname).to.equal('AmAngularGauge');
            done();
        }, 10);
        $timeout.flush();
    });


    function getCompiledElement() {
        var element = angular.element('<gauge-chart chartid="" percentages=""></gauge-chart>');
        var compiledElement = $compile(element)(scope);
        scope.$digest();
        return compiledElement;
    }
})
;