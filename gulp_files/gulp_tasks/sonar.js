module.exports = function (gulp, plugins, args) {
    return function (callback) {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var alljs = [
            './src/**/*.js',
            './*.js'
        ];

        gFun.log('Running Sonar', plugins);
        var sonarqubeScanner = require('sonarqube-scanner');
        return sonarqubeScanner({
            serverUrl: "https://sonarqube.com",
            token: "f03cb72e1cbaafc0466eb9c8d2fde0e4af9b55e5",
            options: {
                'sonar.projectBaseDir': './src/client',
                'sonar.exclusions': 'file:**/*.spec.js,file:**/*.mdl.js,file:**/test-helpers/*.js',
                'sonar.language': 'js'
            }
        }, callback);

    };
};