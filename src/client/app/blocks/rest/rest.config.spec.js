/* jshint -W117, -W030 */
describe('RestConfig', function () {
    beforeEach(function () {
        module('blocks.rest', 'restangular');
        bard.inject('$controller', '$log', '$rootScope', '$q', '$timeout');
        $rootScope.$apply();
    });
    it('should have exceptionFactory defined', inject(function () {
        //expect($restangularProvider.setBaseUrl.calledOnce);
    }));
});
