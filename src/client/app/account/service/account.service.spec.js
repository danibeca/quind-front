/* jshint -W117, -W101*/
/* jscs:disable */
describe('Account Service', function () {

    beforeEach(function () {
        module('app.account', bard.fakeToastr);
        bard.inject('$httpBackend', 'Restangular', 'environmentConfig', 'accountService', '$window');
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('when calls getIndicator', function () {
        it('should get one indicator', function () {

            var spy = sinon.spy(Restangular, 'one');

            $httpBackend.expectGET(environmentConfig.api + '/accounts/1/indicators/2'
            ).respond(accountServiceHtttpMock.getIndicator());

            var result = accountService.getIndicator(1, 2);
            $httpBackend.flush();
            expect(result.$$state.value.code).to.equal('acc_general_code_health');
            spy.should.have.callCount(1);
        });

        it('should return error when HTTP call fails', function () {

            var spy = sinon.spy(Restangular, 'one');

            $httpBackend.expectGET(environmentConfig.api + '/accounts/1/indicators/2'
            ).respond(accountServiceHtttpMock.getError());

            var result = accountService.getIndicator(1, 2);
            $httpBackend.flush();

            expect('An error has occurred').to.equal(result.$$state.value.data.error.message);
            spy.should.have.callCount(1);
        });
    });

    describe('when calls getIndicators', function () {

        it('should get three indicators', function () {
            var spy = sinon.spy(Restangular, 'one');

            $httpBackend.expectGET(environmentConfig.api + '/accounts/1/indicators')
                .respond(accountServiceHtttpMock.getIndicators());

            var result = accountService.getIndicators(1);
            $httpBackend.flush();

            expect(result.$$state.value.length).to.equal(3);
            expect(result.$$state.value[1].code).to.equal('acc_general_reliability');
            spy.should.have.callCount(1);

        });

        it('should return error when HTTP call fails', function () {

            var spy = sinon.spy(Restangular, 'one');

            $httpBackend.expectGET(environmentConfig.api + '/accounts/1/indicators')
                .respond(accountServiceHtttpMock.getError());

            var result = accountService.getIndicators(1);
            $httpBackend.flush();

            expect('An error has occurred').to.equal(result.$$state.value.data.error.message);
            spy.should.have.callCount(1);
        });
    });

});

