/* jshint -W117, -W030 */
describe('LoginController', function () {
    var controller;
    var user = mockData.getMockLogin();

    beforeEach(function () {
        module('app.user', bard.fakeToastr);
        bard.inject('$controller', '$log', '$rootScope', '$q', 'auth', '$state', 'routerHelper', '$timeout');
    });

    beforeEach(function () {
        routerHelper.configureStates(mockData.getMockDashboard(), '/dashboard');
        controller = $controller('LoginController');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    it('should be created successfully', function () {
        expect(controller).to.be.defined;
    });

    it('should call auth.login once', function () {
        //Arrange
        var authMock = sinon.mock(auth);
        authMock.expects('getLogin').once().returns($q.when(user));

        //Act
        controller.login();

        //Assert
        authMock.restore();
        authMock.verify();
    });

    it('call with success the login service', function (done) {
        //Arrange
        sinon.stub(auth, 'getLogin').returns($q.when(user));

        //Act
        controller.login();

        //Assert
        $timeout(function () {
            expect($log.info.logs).to.match(/LOGIN_SUCCESS/);
            done();
        }, 1000);
        $timeout.flush();

    });

    it('call with wrong credentials', function (done) {
        //Arrange
        sinon.stub(auth, 'getLogin').returns($q.when(false));

        //Act
        controller.login();

        //Assert
        $timeout(function () {
            expect($log.error.logs).to.match(/LOGIN_FAILED/);
            done();
        }, 1000);
        $timeout.flush();

    });


    it('fails calling the login service', function (done) {
        //Arrange
        deferred = $q.defer();
        sinon.stub(auth, 'getLogin').returns(deferred.promise);

        //Act
        deferred.reject('Internal Error');
        $rootScope.$apply();
        controller.login();

        //Assert
        $timeout(function () {
            expect($log.error.logs).to.match(/LOGIN_FAILED/);
            done();
        }, 1000);
        $timeout.flush();

    });
});
