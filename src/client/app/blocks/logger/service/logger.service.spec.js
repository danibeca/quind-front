/* jshint -W117, -W030 */
describe('blocks.exception', function () {
    var loggerFactory;

    beforeEach(function () {
        bard.appModule('blocks.logger');
        bard.inject('$rootScope', '$log', 'logger');
    });

    beforeEach(function () {
        loggerFactory = logger;
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('LoggerFactory', function () {
        it('should have loggerFactory defined', inject(function () {
            expect(loggerFactory).to.be.defined;
        }));

        it('should log info messages', inject(function () {
            loggerFactory.info('Testing');
            expect($log.info.logs).to.match(/Testing/);
        }));


        it('should log warning messages', inject(function () {
            loggerFactory.warning('Testing');
            expect($log.warn.logs).to.match(/Testing/);
        }));


    });
});
