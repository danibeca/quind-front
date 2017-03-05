/* jshint -W117, -W030 */
describe('blocks.exception', function () {
    var requestInterceptorFactory;
    var state;

    beforeEach(function () {
        bard.appModule('app.core', 'stateMock');
        bard.inject('$rootScope', '$q', '$injector', 'requestInterceptor', 'user', '$state2', '$httpBackend');
    });

    beforeEach(function () {
        requestInterceptorFactory = requestInterceptor;
        state = $state2;
        state.expectTransitionTo('login');
    });


    describe('requestInterceptorFactory', function () {
        it('should have requestInterceptorFactory defined', inject(function () {
            expect(requestInterceptorFactory).to.be.defined;
        }));

        it('should have request and requestError methods', inject(function () {
            expect(requestInterceptorFactory.request).to.be.defined;
            expect(requestInterceptorFactory.responseError).to.be.defined;
        }));

        it('should redirect when error 400 occurs', inject(function () {
            sinon.stub($injector, 'get').returns(state);
            requestInterceptorFactory.responseError(mockData.getMockRejection().error400);
            expect(state.go.calledOnce);
            $injector.get.restore();
        }));

        it('should redirect when error 401 occurs', inject(function () {
            sinon.stub($injector, 'get').returns(state);
            requestInterceptorFactory.responseError(mockData.getMockRejection().error401);
            expect(state.go.calledOnce);
            $injector.get.restore();
        }));

        it('should send the request again when error 401 occurs recall', inject(function () {
            $httpBackend.expectGET('/testing/recall').respond({hello: 'World'});
            requestInterceptorFactory.responseError(mockData.getMockRejection().error401NotVerified);

        }));
    });
});
