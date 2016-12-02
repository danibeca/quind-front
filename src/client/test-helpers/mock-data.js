/* jshint -W079, -W109*/
/*jshint unused:false, maxlen:false*/
/* jscs:disable */
var mockData = (function () {
    return {
        getMockStates: getMockStates,
        getMockDashboard: getMockDashboard,
        getMockLogin: getMockLogin,
        getMockLoginRequest: getMockLoginRequest,
        getJSONInternalError: getJSONInternalError
    };

    function getMockStates() {
        return [
            {
                state: 'home',
                config: {
                    url: '/',
                    templateUrl: 'app/home/template/home.html',
                    title: 'home',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-home"></i> Home'
                    }
                }
            }
        ];
    }

    function getMockDashboard() {
        return [
            {
                state: 'dashboard',
                config: {
                    url: '/dashboard',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }
        ];
    }

    function getMockLogin() {
        return [
            {
                'id': 1,
                'email': 'danibeca@okazo.co',
                'name': 'Daniel Betancur',
                'created_at': {
                    'date': '2016-09-07 21:19:14',
                    'timezone_type': 3,
                    'timezone': 'UTC'
                },
                'updated_at': {
                    'date': '2016-10-20 06:05:37',
                    'timezone_type': 3,
                    'timezone': 'UTC'
                },
                'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImlzcyI6Imh0dHA6XC9cL2xvY2FsaG9zdFwvbGFyYXZlbFwvc2lnbWFcL2FwaVwvbG9naW4iLCJpYXQiOjE0NzM5MTIwMTcsImV4cCI6MTQ3MzkxNTYxNywibmJmIjoxNDczOTEyMDE3LCJqdGkiOiJmMmUyNjFkNzcwNDUwMzJlODFiMDJjMTU0NzU0Yjk5ZiJ9.LmaH6gMzLXP-Yn9EFxiNzAxWA01gDQca-ZDQOTtGXAw'
            }
        ];
    }

    function getMockLoginRequest() {
        return [
            {
                'email': 'danibeca@okazo.co',
                'password': 'testing'
            }
        ];
    }

    function getJSONInternalError() {
        return getJSON('{"error": {"message": "Internal Error", "status_code": 500}}');
    }

    function getJSON(s) {
        s = s.replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f");

        return s.replace(/[\u0000-\u0019]+/g, "");
    }

})();
