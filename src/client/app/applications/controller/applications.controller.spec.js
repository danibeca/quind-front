/* jshint -W117, -W030 */
describe('ApplicationsController', function () {
    var controller;
    var mockAppServ = mockAppService;
    beforeEach(function () {
        module('app.applications', bard.fakeToastr);
        bard.inject('$controller', '$log', '$rootScope', '$q', '$state', '$timeout', '$window', 'spinnerService');
    });


    it('should be created successfully', function () {
        expect(controller).to.be.defined;
    });

    it('should fail went the service fails', function () {

        var deferred = $q.defer();
        sinon.stub(mockAppServ, 'getApplications').returns(deferred.promise);
        sinon.stub(mockAppServ, 'getGeneralIndicators').returns($q.when([mockAppServ.getIndicatorData()]));
        sinon.stub(spinnerService, 'hide').returns(0);

        var error = [];
        error['msgCode'] = 'HOUSTON_WE_GOT_A_PROBLEM';
        deferred.reject(error);
        controller = $controller('ApplicationsController', {
            'appservice': mockAppServ
        });


        controller = $controller('ApplicationsController');
        $rootScope.$apply();

        expect(error['msgCode']).to.equal(controller.msgError);
        mockAppServ.getApplications.restore();
        mockAppServ.getGeneralIndicators.restore();
    });

    describe('on activate', function () {

        beforeEach(function () {
            sinon.stub(mockAppServ, 'getApplications').returns($q.when(mockAppServ.getApplicationsData()));
            sinon.stub(mockAppServ, 'getGeneralIndicators').returns($q.when(mockAppServ.getIndicatorData()));

            controller = $controller('ApplicationsController', {
                'appservice': mockAppServ
            });
            $rootScope.$apply();
        });

        afterEach(function () {
            mockAppServ.getApplications.restore();
            mockAppServ.getGeneralIndicators.restore();
        });

        it('should call app.getApplications once', function () {
            expect(mockAppServ.getApplications.calledOnce);
        });

        it('should call app.getIndicator once', function () {
            expect(mockAppServ.getGeneralIndicators.calledOnce);
        });

        it('vm.applications should have  once', function () {
            expect(controller.applications).to.have.length(14);
        });

        it('vm.applications[0] should have and attr chartID', function () {
            expect(controller.applications[0]).to.have.property('chartId');
        });

    });

});
