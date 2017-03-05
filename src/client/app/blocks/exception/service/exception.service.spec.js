/* jshint -W117, -W030 */
describe('blocks.exception', function () {
    var exceptionFactory;

    beforeEach(function () {
        bard.appModule('blocks.exception');
        bard.inject('$rootScope', 'exception');
    });

    beforeEach(function () {
        exceptionFactory = exception;
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('exceptionFactory', function () {
        it('should have exceptionFactory defined', inject(function () {
            expect(exceptionFactory).to.be.defined;
        }));

        it('should have configuration', inject(function () {
            expect(exceptionFactory.catcher).to.be.defined;
        }));

        it('should have configuration', inject(function () {
            expect(exceptionFactory.catcher).to.be.defined;
        }));

        it('should throw an error when it is called', inject(function () {
            expect(exceptionFactory.catcher('Testing')).to.throw();
        }));
    });
});
