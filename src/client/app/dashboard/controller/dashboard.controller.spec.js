/* jshint -W117, -W030 */
describe('DashboardController', function () {
    var controller;

    beforeEach(function () {
        bard.appModule('app.dashboard', 'app.account');
        bard.inject('$controller', '$rootScope', '$q', 'accountService', 'user', 'spinnerService');
    });

    afterEach(function () {
        accountService.getIndicators.restore();
        user.getUser.restore();
    });

    describe('on activate', function () {

        beforeEach(function () {
            sinon.stub(accountService, 'getIndicators')
                .returns($q.when(accountServiceDataMock.getIndicators()));
            sinon.stub(user, 'getUser').returns(mockData.getMockLogin());
            controller = $controller('DashboardController');
            $rootScope.$apply();
        });


        it('should call accountServices once', function () {
            expect(accountService.getIndicators.calledOnce);
            expect(accountService.getIndicators.calledWithExactly([1]));
        });
    });


    it('should fail when account service fails', function () {
        var deferred = $q.defer();
        sinon.stub(accountService, 'getIndicators')
            .returns(deferred.promise);
        sinon.stub(user, 'getUser').returns(mockData.getMockLogin());

        var error = [];
        error['msgCode'] = 'HOUSTON_WE_GOT_A_PROBLEM2';
        deferred.reject(error);

        controller = $controller('DashboardController');
        $rootScope.$apply();

        expect(error['msgCode']).to.equal(controller.msgError);
    });

});
