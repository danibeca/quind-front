/* jshint -W117, -W030 */
describe('DashboardController', function () {
    var controller;

    beforeEach(function () {
        bard.appModule('app.dashboard', 'app.account');
        bard.inject('$controller', '$rootScope', '$q', 'accountService', 'user', 'spinnerService');
    });

    afterEach(function () {
        accountService.getIndicators.restore();
        accountService.getQAIndicatorSeries.restore();
        user.getUser.restore();
    });

    describe('on activate', function () {

        beforeEach(function () {
            sinon.stub(accountService, 'getQAIndicatorSeries')
                .returns($q.when(accountServiceDataMock.getQAIndicatorSeries()));
            sinon.stub(accountService, 'getQAIndicators')
                .returns($q.when(accountServiceDataMock.getQAIndicators()));
            sinon.stub(user, 'getUser').returns(mockData.getMockLogin());
            controller = $controller('DashboardController');
            $rootScope.$apply();
        });


        it('should call accountServices getQAIndicator once', function () {
            expect(accountService.getQAIndicators.calledOnce);
            expect(accountService.getQAIndicators.calledWithExactly([1]));
        });

        it('should call accountServices getQAIndicatorSeries three times', function () {
            expect(accountService.getQAIndicatorSeries.calledThrice);
            expect(accountService.getQAIndicators.calledWithExactly([1, 1]));
        });

        it('should fill data in the controller', function () {
            expect(controller.data[0].id).to.equal(1);
            expect(controller.data[0].name).to.equal('Salud del Codigo');
            expect(controller.data[0].code).to.equal('acc_general_code_health');
        });

        it('should fill lang vars ids labels and series in the controller', function () {
            expect(controller.lang).to.equal('es');
            expect(controller.vars[0]).to.equal('value');
            expect(controller.vars[1]).to.equal('date');
            expect(controller.ids[0]).to.equal(1);
            expect(controller.ids[1]).to.equal(2);
            expect(controller.ids[2]).to.equal(3);
            expect(controller.labels[1].title).to.equal('Salud del Codigo');
            expect(controller.labels[2].title).to.equal('Confiabilidad');
            expect(controller.labels[3].title).to.equal('Potencial de Eficiencia');
            expect(controller.series[1].length).to.equal(5);
        });
    });


    it('should fail when getQAIndicators fails', function () {
        sinon.stub(accountService, 'getQAIndicatorSeries')
            .returns($q.when(accountServiceDataMock.getQAIndicatorSeries()));

        var deferred = $q.defer();
        sinon.stub(accountService, 'getQAIndicators')
            .returns(deferred.promise);
        sinon.stub(user, 'getUser').returns(mockData.getMockLogin());

        var error = [];
        error['msgCode'] = 'HOUSTON_WE_GOT_A_PROBLEM2';
        deferred.reject(error);

        controller = $controller('DashboardController');
        $rootScope.$apply();

        expect(error['msgCode']).to.equal(controller.msgError);
    });

    it('should fail when getQAIndicatorSeries fails', function () {
        var deferred = $q.defer();
        sinon.stub(accountService, 'getQAIndicatorSeries')
            .returns(deferred.promise);
        sinon.stub(user, 'getUser').returns(mockData.getMockLogin());
        sinon.stub(accountService, 'getQAIndicators')
            .returns($q.when(accountServiceDataMock.getQAIndicators()));

        var error = [];
        error['msgCode'] = 'HOUSTON_WE_GOT_A_PROBLEM2';
        deferred.reject(error);

        controller = $controller('DashboardController');
        $rootScope.$apply();

        expect(error['msgCode']).to.equal(controller.msgError);
    });

});
