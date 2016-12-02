/* jshint -W117, -W030 */

describe('home route', function () {
    describe('state', function () {
        var view = 'app/home/template/home.html';

        beforeEach(function () {
            module('app.home', bard.fakeToastr);
            bard.inject('$httpBackend', '$rootScope', '$state', '$templateCache');
        });

        beforeEach(function () {
            $templateCache.put(view, '');
        });


        it('should map /home route to Home View template ', function () {
            expect($state.get('home').templateUrl).to.equal(view);
        });

        it('should map state home to url / ', function () {
            expect($state.href('home')).to.equal('/');
        });

        it('of home should work with $state.go', function () {
            $state.go('home');
            $rootScope.$apply();
            expect($state.current.templateUrl).to.equal(view);
        });
    });
});
