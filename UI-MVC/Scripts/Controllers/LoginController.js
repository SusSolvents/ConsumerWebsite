app.factory('AuthenticationService', function() {
    var auth = {
        isLogged: false
    }
return auth;
});
var error;
app.factory('UserService', ['$http', '$window', '$rootScope', function($http, $window, $rootScope) {
    var returnData;
    return {
        logIn: function (username, password) {
            var loginData = {
                grant_type: 'password',
                username: username,
                password: password
            };
            $http.post("api/Account/IsAccountEnabled?email=" + username)
                .error(function errorCallback(data) {
                    error = data;
                })
                .success(function succesCallback(data) {

                });
            return $http({
                method: 'POST',
                url: '/Token',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: loginData
            }).success(function succesCallback(data) {
                if (error != null) {
                    return error;
                }
                returnData = data;
                return returnData;
            }).error(function errorCallback(data) {
                if (error != null) {
                    return null;
                }
                error = "Email or password is incorrect";
                return error;
            });
            
        },
        logOut: function() {

        }
    }
}]);

app.controller('LoginController', ['$scope', '$location', '$window', '$rootScope', 'UserService', 'AuthenticationService', '$http',
    function LoginController($scope, $location, $window, $rootScope, UserService, AuthenticationService, $http) {

        //Admin User Controller (login, logout)
        $scope.logIn = function logIn(username, password) {
            if (username !== undefined && password !== undefined) {
                UserService.logIn(username, password).success(function(data){
                    AuthenticationService.isLogged = true;
                    $window.sessionStorage.token = data.access_token;
                    $window.sessionStorage.username = username;
                    $http({
                        method: 'GET',
                        url: '/api/Account/GetUserId?email=' + username
                    }).success(function(data) {
                        $window.sessionStorage.userId = data;
                        $rootScope.userId = data;
                        console.log(data);
                    });
                    $rootScope.username = username;
                    $('#login-modal').modal('hide');
                }).error(function (status, data) {
                    $scope.errorlogin = error;
                });
            }
        }

        $scope.logOut = function logOut() {
            if ($rootScope.username) {
                AuthenticationService.isLogged = false;
                delete $window.sessionStorage.token;
                delete $rootScope.username;
                delete $window.sessionStorage.username;
                $location.path("/");
            }
        }
        $scope.closeModal = function closeModal() {
            $('#login-modal').modal('hide');
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