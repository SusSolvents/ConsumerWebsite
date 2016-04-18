app.factory('AuthenticationService', function() {
    var auth = {
        isLogged: false
    }
return auth;
});

app.factory('UserService', ['$http', '$window', '$rootScope', function($http, $window, $rootScope) {
    var returnData;
    return {
        logIn: function (username, password) {
            var loginData = {
                grant_type: 'password',
                username: username,
                password: password
            };
             return $http({
                method: 'POST',
                url: '/Token',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: loginData
            }).success(function succesCallback(data) {
                console.log(data);
                returnData = data;
                 $rootScope.username = username;
                 return returnData;
             }).error (function errorCallback(data) {
                $scope.message = "email or password is incorrent";
            });
        },
        logOut: function() {

        }
    }
}]);

app.controller('LoginController', ['$scope', '$location', '$window', '$rootScope', 'UserService', 'AuthenticationService',
    function LoginController($scope, $location, $window, $rootScope, UserService, AuthenticationService) {

        //Admin User Controller (login, logout)
        $scope.logIn = function logIn(username, password) {
            if (username !== undefined && password !== undefined) {
                UserService.logIn(username, password).success(function(data){
                    AuthenticationService.isLogged = true;
                    $window.sessionStorage.token = data.access_token;
                    $window.sessionStorage.username = username;
                    $location.path("/");
                }).error(function (status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        }

        $scope.logout = function logout() {
            if (AuthenticationService.isLogged) {
                AuthenticationService.isLogged = false;
                delete $window.sessionStorage.token;
                delete $rootScope.username;
                $location.path("/");
            }
        }
    }
]);

app.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },

        requestError: function (rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function (rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                AuthenticationService.isAuthenticated = false;
                $location.path("/");
            }

            return $q.reject(rejection);
        }
    };
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});