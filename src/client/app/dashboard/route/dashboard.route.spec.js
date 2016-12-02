/* jshint -W117, -W030 */

describe('dashboard route', function () {
    describe('state', function () {
        var view = 'app/dashboard/template/dashboard.html';

        beforeEach(function() {
            module('app.dashboard', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache');
        });

        beforeEach(function() {
            $templateCache.put(view, '');
        });

        it('should map /dashboard route to Dashboard View template ', function() {
            expect($state.get('dashboard').templateUrl).to.equal(view);
        });

        it('should map state dashboard to url / ', function() {
            expect($state.href('dashboard')).to.equal('/dashboard');
        });

        it('of dashboard should work with $state.go', function () {
            $state.go('dashboard');
            $rootScope.$apply();
            expect($state.current.templateUrl).to.equal(view);
        });
    });
});
