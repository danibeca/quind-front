/* jshint -W117 */
describe('User Authentication Service', function () {
    var requestData = mockData.getMockLoginRequest();
    var responseData = mockData.getMockLogin();
    var responseError = mockData.getJSONInternalError();

    beforeEach(function () {
        module('app.user', bard.fakeToastr);
        bard.inject('$controller', '$log', '$rootScope', 'auth', '$httpBackend', 'environmentConfig');
    });

    beforeEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should call successfully auth.login', function () {
        //Arrange
        $httpBackend.when('POST', environmentConfig.api + '/login').respond(responseData);

        //Act & Assert
        auth.getLogin(requestData).then(function (data) {
            assert.equal(data[0].email, 'danibeca@okazo.co');
        });

        $httpBackend.flush();

    });

    it('should call successfully auth.login', function () {
        //Arrange
        $httpBackend.when('POST', environmentConfig.api + '/login').respond(500, responseError);
        //Act
        auth.getLogin(requestData).catch(function (error) {
            assert.equal(error.data.error.message, 'Internal Error');
            assert.equal(error.data.error['status_code'], 500);
        });

        $httpBackend.flush();
    });

})
;
