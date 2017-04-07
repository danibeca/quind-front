/**
 * @author Daniel Betancur <danibeca@okazo.co>
 * created on 03.30.2017
 */
/* jshint -W117, -W030*/
/* jscs:disable */
describe('Multiple Data Set Chart Service', function () {
    var data, panels, transformedData;

    beforeEach(function () {
        module('blocks.amcharts3', 'blocks.theme', bard.fakeToastr,
            bard.fakeRouteHelperProvider,
            bard.fakeRouteProvider,
            bard.fakeStateProvider);
        bard.inject('stockMultipleService');
    });

    describe('Method getDataSets', function () {
        beforeEach(function () {
            data = stockMultipleDirDataMock.getAll(accountServiceDataMock.getIndicatorSeries());
            transformedData = stockMultipleService.getDataSets(data.ids, data.vars, data.labels, data.series);
        });

        it('should return an array', function () {
            expect(transformedData).to.be.instanceof(Array);
            expect(transformedData.length).to.equal(2);
            expect(transformedData[0].title).to.equal(data.labels[1].title);
            expect(transformedData[0].categoryField).to.equal(data.vars[1]);
        });

    });

    describe('Method getPanels', function () {
        it('should return an array with right values', function () {
            data = stockMultipleDirDataMock.getAll(accountServiceDataMock.getIndicatorSeries());
            panels = stockMultipleService.getPanels(data.vars);
            expect(panels).to.be.instanceof(Array);
            expect(panels[0].stockGraphs[0].valueField).to.equal(data.vars[0]);
        });
    });

    describe('Method getTranslations', function () {
        it('should return an array with esp value if ES is pass as argument', function () {
            var translations = stockMultipleService.getTranslations('es');
            expect(translations).to.be.instanceof(Object);
            expect(translations.oneMonth).to.equal('Un mes');
            expect(translations.thisYear).to.equal(2017);
        });

        it('should return an english translations otherwise', function () {
            var translations = stockMultipleService.getTranslations();
            expect(translations).to.be.instanceof(Object);
            expect(translations.oneMonth).to.equal('1 month');
            expect(translations.thisYear).to.equal('YTD');
        });
    });

    describe('Method getPeriodSelector', function () {
        it('should return an object with the right values', function () {
            var periodSelector = stockMultipleService.getPeriodSelector(stockMultipleService.getTranslations('es'));
            expect(periodSelector).to.be.instanceof(Object);
            expect(periodSelector.periods[0].label).to.equal('Un mes');
        });
    });

    describe('Method getResponsive', function () {
        it('should return an object with the right values', function () {
            var responsive = stockMultipleService.getResponsive();
            expect(responsive).to.be.instanceof(Object);
            expect(responsive.rules.length).to.equal(2);
            expect(responsive.enabled).to.equal(true);
        });
    });


    describe('Method transformData', function () {
        beforeEach(function () {
            data = stockMultipleDirDataMock.getAll(accountServiceDataMock.getIndicatorSeries());
            transformedData = stockMultipleService.transformData(data.ids, data.vars, data.labels, data.series, 'es');
        });

        it('should return a array', function () {
            expect(transformedData).to.be.instanceof(Array);
        });

        it('should return a dataSets array', function () {
            expect(transformedData.dataSets).to.be.instanceof(Array);
        });

        it('should return a fieldMappings for every dataSet', function () {
            expect(transformedData.dataSets[0].fieldMappings).to.be.instanceof(Array);
            expect(transformedData.dataSets[0].fieldMappings[0].fromField).to.equal(data.vars[0]);
            expect(transformedData.dataSets[0].fieldMappings[0].toField).to.equal(data.vars[0]);
        });

        it('should return a dataProvider array with five elements', function () {
            expect(transformedData.dataSets[0].dataProvider).to.be.instanceof(Array);
            expect(transformedData.dataSets[0].dataProvider.length).to.equal(5);
        });

        it('should have compared equal to true after the first element', function () {
            expect(transformedData.dataSets[0].compared).to.be.undefined;
            expect(transformedData.dataSets[1].compared).to.equal(true);
        });

        it('should return panels with the right vars', function () {
            expect(transformedData.panels[0].stockGraphs[0].valueField).to.equal(data.vars[0]);
        });

        it('should return translations with the right vars', function () {
            expect(transformedData.translations.oneMonth).to.equal('Un mes');
        });

        it('should return periodSelector with translate values', function () {
            expect(transformedData.periodSelector.periods[1].label).to.equal('Un año');
        });

        it('should return responsive object', function () {
            expect(transformedData.responsive.rules[0].maxWidth).to.equal(314);
        });
    });
});
