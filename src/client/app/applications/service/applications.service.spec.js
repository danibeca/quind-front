/* jshint -W117, -W101*/
/* jscs:disable */
describe('Applications Service', function () {

    var responseGetApplications = mockAppService.getApplicationsData();

    beforeEach(function () {
        module('app.applications', bard.fakeToastr);
        bard.inject('appservice', '$httpBackend', 'environmentConfig');
    });

    beforeEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should call get Applications', function () {

        $httpBackend.when('GET', environmentConfig.api + '/applications').respond(responseGetApplications);

        appservice.getApplications().then(function (data) {
            assert.equal(data[0].name, 'Localizacion');
        });

        $httpBackend.flush();

    });

    it('should call get Applications and get an error', function () {
        $httpBackend.when('GET', environmentConfig.api + '/applications').respond(function () {
            return [500, '{"error":{"message":"An error has occurred","statusCode":500}}'];
        });

        appservice.getApplications().catch(function (response) {
            assert.equal('An error has occurred', response.data.error.message);
        });
        $httpBackend.flush();
    });

});
