/**
 * @author Daniel Betancur <danibeca@okazo.co>
 * created on 02.22.2017
 */
/* jshint -W117, -W030*/
/* jscs:disable */
describe('Gauge Service', function () {
    var band;
    var data;
    var transformedData;
    var responsive = [];
    var responsiveBase;

    beforeEach(function () {
        module('blocks.amcharts3');
        bard.inject('gaugeService');
    });

    describe(' Method transformData', function () {
        beforeEach(function () {
            data = accountServiceDataMock.getQAIndicators();
            transformedData = gaugeService.transformData(data);
        });

        it('should return an array', function () {
            expect(transformedData).to.be.instanceof(Array);
        });

        it('should return a band array', function () {
            expect(transformedData.bands).to.be.instanceof(Array);
            expect(transformedData.bands.length).to.equal(6);
        });

        it('should return a label array', function () {
            expect(transformedData.labels).to.be.instanceof(Array);
            expect(transformedData.labels.length).to.equal(3);
        });


        it('should correlate value and color in bands', function () {
            expect(transformedData.bands[1].color).to.equals('#5EBE01');
        });

        it('should correlate value and color in labels', function () {
            expect(transformedData.labels[0].color).to.equals('#000');
        });

        it('should return the maximum of items allowed when the limit is exceeded', function () {
            limitedResult = gaugeService.transformData(accountServiceDataMock.getQAIndicatorsExceeded());
            expect(limitedResult.bands.length).to.equal(10);
            expect(limitedResult.labels.length).to.equal(5);
        });

        it('should return an responsive array with four rules', function () {
            expect(transformedData.responsiveRules).to.be.instanceof(Array);
            expect(transformedData.responsiveRules.length).to.equal(4);
        });
    });


    describe(' Method getBands', function () {

        beforeEach(function () {
            band = gaugeService.getBands(30.40, '#ED2E08', 100, 85);
        });

        it('should return an array after executing', function () {
            expect(band).to.be.instanceof(Array);
        });

        it('should return an object with the right props', function () {
            band.forEach(function (ele) {
                expect(ele.color).to.not.be.undefined;
                expect(ele.startValue).to.not.be.undefined;
                expect(ele.endValue).to.not.be.undefined;
                expect(ele.radius).to.not.be.undefined;
                expect(ele.innerRadius).to.not.be.undefined;
            });

        });

        it('should return an object with the right prop values', function () {
            expect(band[1].balloonText).to.not.be.undefined;
            expect(band[1].color).to.equal('#ED2E08');
            expect(band[0].color).to.equal('#EEE');
        });


        it('should return a band with two elements', function () {
            expect(band.length).to.equal(2);
        });

    });

    describe(' method getLabel', function () {
        beforeEach(function () {
            label = gaugeService.getLabel('First Option', 5, 14, false, '#84b761');
        });

        it('should return an object after executing', function () {
            expect(label).to.be.instanceof(Object);
        });

        it('should return an object with the right props', function () {
            expect(label.text).to.be.not.undefined;
            expect(label.x).to.be.not.undefined;
            expect(label.y).to.be.not.undefined;
            expect(label.size).to.be.not.undefined;
            expect(label.bold).to.be.not.undefined;
            expect(label.color).to.be.not.undefined;
            expect(label.align).to.be.not.undefined;
        });

        it('should return an object with the right prop values', function () {
            expect(label.text).to.equal('First Option');
            expect(label.y).to.equal('5%');
            expect(label.color).to.equal('#84b761');
            expect(label.size).to.equal(14);
        });

    });

    describe(' method getResponsiveLabel', function () {
        beforeEach(function () {
            responsive.setOfRules = [
                {
                    'id': 1,
                    'maxWidth': 214,
                    'overrides': {
                        'allLabels': []
                    }
                }];
            responsive.ruleParams = [];
            responsive.ruleParams[1] = {
                'size': 13,
                'referencePositionY': -8,
                'distancePositionY': 13,
                'isBold': false,
                'color': '#94B761'
            };
        });

        describe('with one rule', function () {
            beforeEach(function () {
                responsive = gaugeService.addResponsiveLabel(responsive, 'First Option');
                responsive = gaugeService.addResponsiveLabel(responsive, 'Hello World');
            });

            it('should add more than one label', function () {
                expect(responsive.setOfRules[0].overrides.allLabels.length).to.equal(2);
            });

            it('should return rules with the right props values', function () {
                expect(responsive.setOfRules[0].overrides.allLabels[0].text).to.equal('First Option');
                expect(responsive.setOfRules[0].overrides.allLabels[1].text).to.equal('Hello World');
                expect(responsive.setOfRules[0].overrides.allLabels[0].y).to.equal('5%');
                expect(responsive.setOfRules[0].overrides.allLabels[1].y).to.equal('18%');

                expect(responsive.setOfRules[0].overrides.allLabels[0].size).to.equal(13);
                expect(responsive.setOfRules[0].overrides.allLabels[0].bold).to.equal(false);
                expect(responsive.setOfRules[0].overrides.allLabels[0].color).to.equal('#94B761');

            });

            it('should shrink the text if it is bigger than 18 characters', function () {
                responsive = gaugeService.addResponsiveLabel(responsive, 'General Potential Efficiency');
                expect(responsive.setOfRules[0].overrides.allLabels[2].text).to.equal('Gen. Potential Efficiency');
            });
        });


        it('should work for two rules', function () {
            responsive.setOfRules.push({
                'id': 2,
                'maxWidth': 300,
                'overrides': {
                    'allLabels': []
                }
            });
            responsive.ruleParams[2] = {
                'size': 15,
                'referencePositionY': -5,
                'distancePositionY': 15,
                'isBold': true,
                'color': '#94B762'
            };
            responsive = gaugeService.addResponsiveLabel(responsive, 'First Option');
            responsive = gaugeService.addResponsiveLabel(responsive, 'Second Option');

            expect(responsive.setOfRules[1].overrides.allLabels[0].text).to.equal('First Option');
            expect(responsive.setOfRules[1].overrides.allLabels[0].size).to.equal(15);
            expect(responsive.setOfRules[1].overrides.allLabels[0].bold).to.equal(true);
            expect(responsive.setOfRules[1].overrides.allLabels[0].color).to.equal('#94B762');
        });


    });

    describe('method getResponsiveBase', function () {
        beforeEach(function () {
            responsiveBase = gaugeService.getResponsiveBase();
        });

        it('should have two arrays setOfRules and ruleParams', function () {
            expect(responsiveBase.setOfRules).to.be.instanceof(Array);
            expect(responsiveBase.ruleParams).to.be.instanceof(Array);

        });

        it('should return a ruleset with four elements', function () {
            expect(responsiveBase.setOfRules.length).to.equal(4);
        });

        it('should return the right data for rule one', function () {
            expect(responsiveBase.ruleParams[1].size).to.be.equal(10);
            expect(responsiveBase.ruleParams[1].referencePositionY).to.be.equal(16);
            expect(responsiveBase.ruleParams[1].distancePositionY).to.be.equal(5);
            expect(responsiveBase.ruleParams[1].isBold).to.be.equal(true);
            expect(responsiveBase.ruleParams[1].color).to.be.equal('#000');
        });

        it('should return the right data for rule two', function () {
            expect(responsiveBase.ruleParams[2].size).to.be.equal(12);
            expect(responsiveBase.ruleParams[2].referencePositionY).to.be.equal(10);
            expect(responsiveBase.ruleParams[2].distancePositionY).to.be.equal(7);
            expect(responsiveBase.ruleParams[2].isBold).to.be.equal(true);
            expect(responsiveBase.ruleParams[2].color).to.be.equal('#000');
        });

        it('should return the right data for rule three', function () {
            expect(responsiveBase.ruleParams[3].size).to.be.equal(13);
            expect(responsiveBase.ruleParams[3].referencePositionY).to.be.equal(6);
            expect(responsiveBase.ruleParams[3].distancePositionY).to.be.equal(7);
            expect(responsiveBase.ruleParams[3].isBold).to.be.equal(true);
            expect(responsiveBase.ruleParams[3].color).to.be.equal('#000');
        });

        it('should return the right data for rule four', function () {
            expect(responsiveBase.ruleParams[4].size).to.be.equal(14);
            expect(responsiveBase.ruleParams[4].referencePositionY).to.be.equal(1);
            expect(responsiveBase.ruleParams[4].distancePositionY).to.be.equal(8);
            expect(responsiveBase.ruleParams[4].isBold).to.be.equal(true);
            expect(responsiveBase.ruleParams[4].color).to.be.equal('#000');
        });


    });

    describe('method getColor', function () {

        it('should get color green between 80 and 100', function () {
            var color = gaugeService.getColor(100);
            expect(color).to.equal('#5EBE01');
        });

        it('should get color yellow between 51 and 79', function () {
            var color = gaugeService.getColor(75);
            expect(color).to.equal('#FFFF4D');
        });

        it('should get color orange between 39 and 50', function () {
            var color = gaugeService.getColor(42);
            expect(color).to.equal('#FE7903');
        });

        it('should get color red between 0 and 38', function () {
            var color = gaugeService.getColor(10);
            expect(color).to.equal('#ED2E08');
        });
    });

    describe('method shrinkText', function () {

        it('shouldnt shrink the text if it is smaller than 18 chars', function () {
            var shrunkenText = gaugeService.shrinkText('Health Code');
            expect(shrunkenText).to.equal('Health Code');
        });

        it('should shrink the text if it is bigger than 18 chars', function () {
            var shrunkenText = gaugeService.shrinkText('General Potential Efficiency');
            expect(shrunkenText).to.equal('Gen. Potential Efficiency');
        });

    });

});