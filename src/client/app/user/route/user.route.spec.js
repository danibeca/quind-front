/* jshint -W117 */
describe('user route', function () {
    describe('state', function () {
        var views = {
            login: 'app/user/template/login.html'
        };

        beforeEach(function() {
            module('app.user', bard.fakeToastr);
            bard.inject('$rootScope', '$state', '$templateCache');
        });

        beforeEach(function() {
            $templateCache.put(views.user, '');
        });

        it('should map /login route to Login View template ', function() {
            expect($state.get('login').templateUrl).to.equal(views.login);
        });

        it('should map state login to url / ', function() {
            expect($state.href('login')).to.equal('/login');
        });

        it('of login should work with $state.go', function () {
            $state.go('login');
            $rootScope.$apply();
            expect($state.current.templateUrl).to.equal(views.login);
        });
    });
});
