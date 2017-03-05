/* jshint -W117, -W030 */
describe('ApplicationsController', function () {
    var controller;
    var mockAppServ = mockAppService;
    beforeEach(function () {
        module('app.applications', bard.fakeToastr);
        bard.inject('$controller', '$log', '$rootScope', '$q', '$state', '$timeout');
    });

    beforeEach(function () {
        sinon.stub(mockAppServ, 'getApplications').returns($q.when(mockAppServ.getApplicationsData()));
        sinon.stub(mockAppServ, 'getIndicator').returns($q.when(mockAppServ.getIndicatorData()));

        controller = $controller('ApplicationsController', {
            'appservice': mockAppServ
        });
        $rootScope.$apply();
    });

    afterEach(function () {
        mockAppServ.getApplications.restore();
        mockAppServ.getIndicator.restore();
    });

    it('should be created successfully', function () {
        expect(controller).to.be.defined;
    });

    describe('on activate', function () {

        it('should call app.getApplications once', function () {
            expect(mockAppServ.getApplications.calledOnce);
        });

        it('should call app.getIndicator once', function () {
            expect(mockAppServ.getIndicator.calledOnce);
        });

        it('vm.applications should have  once', function () {
            expect(controller.applications).to.have.length(7);
        });

        it('vm.applications[0] should have and attr percent equeal to 73', function () {
            expect(controller.applications[0]).to.have.property('percent');
            expect(controller.applications[0].percent).eq(73);
        });

    });

});
