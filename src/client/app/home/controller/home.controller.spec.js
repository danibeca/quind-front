/* jshint -W117, -W030 */
describe('HomeController', function() {
    var controller;

    beforeEach(function() {
        bard.appModule('app.home');
        bard.inject('$controller', '$rootScope');
    });

    beforeEach(function () {
        controller = $controller('HomeController');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Home controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });
    });
});
