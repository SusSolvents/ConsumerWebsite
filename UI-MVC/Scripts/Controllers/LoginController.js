var error = null;
angular.module('sussol.services', [])
    .factory('AuthenticationService', function () {
        var auth = {
            isLogged: false
        }
        return auth;
    })
.factory('UserService', ['$http', '$window', '$rootScope', function($http, $window, $rootScope) {
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
                if (error !== null) {
                    return error;
                }
                returnData = data;
                return returnData;
            }).error(function errorCallback(data) {
                if (error !== null) {
                    return null;
                }
                error = "Email or password is incorrect";
                return error;
            });
            
        },
        logOut: function() {

        }
    }
}])
.factory('TokenInterceptor', [
        '$q', '$window', '$location', 'AuthenticationService', function ($q, $window, $location, AuthenticationService) {
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
        }])
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('TokenInterceptor');
});



angular.module('sussol.controllers', ['sussol.services', 'sussol.constants'])

    .controller('LoginController', ['$scope', '$location', '$window', '$rootScope', 'UserService', 'AuthenticationService', '$http', '$timeout',
    function LoginController($scope, $location, $window, $rootScope, UserService, AuthenticationService, $http, $timeout) {

        //Admin User Controller (login, logout)
        $scope.logIn = function logIn(username, password) {
            if (username !== undefined && password !== undefined) {
                $('#load').button('loading');
                UserService.logIn(username, password).success(function (data) {
                    if (error !== null) {
                        $scope.errorlogin = error;
                        $('#load').button('reset');
                    } else {
                        AuthenticationService.isLogged = true;
                        $window.sessionStorage.token = data.access_token;
                        $window.sessionStorage.username = username;
                        delete $scope.errorlogin;
                        $http({
                            method: 'GET',
                            url: 'api/Account/GetRole',
                            params: { email: username }
                        }).success(function succesCallback(role) {

                            $window.sessionStorage.role = role;
                            $http({
                            method: 'GET',
                            url: '/api/Account/GetUserId?email=' + username
                            }).success(function (data) {
                            $window.sessionStorage.userId = data;
                            $rootScope.userId = data;
                            $rootScope.username = username;
                            $('#load').button('reset');
                            $('#login-modal').modal('hide');
                            if ($window.sessionStorage.role === "SuperAdministrator") {
                                    $window.sessionStorage.admin = true;
                                    console.log("Logged in as: " + role);
                                    $timeout($location.path("/account/admin"));
                                } else {
                                    console.log("no superadmin");
                                    $window.sessionStorage.admin = false;
                                    $timeout($location.path("/account/" + data));
                                }
                            });
                        });
                    }
                    error = null;
                }).error(function (status, data) {
                    $scope.errorlogin = error;
                    error = null;
                        $('#load').button('reset');
                });
            }
        }

        $scope.logOut = function logOut() {
            if ($rootScope.username) {
                AuthenticationService.isLogged = false;
                delete $window.sessionStorage.token;
                delete $rootScope.username;
                delete $window.sessionStorage.username;
                delete $window.sessionStorage.role;
                delete $window.sessionStorage.admin;
                $location.path("/");
            }
        }
        $scope.closeModal = function closeModal() {
            $('#login-modal').modal('hide');
        }
    }
]);


angular.module('sussol.constants', [])
.constant('constants', {
    AlgorithmName: {
        0: 'CANOPY',
        1: 'EM',
        2: 'KMEANS',
        3: 'SOM',
        4: 'XMEANS'
    },
    FeatureName: {
        0: 'Boiling_Point_Minimum_°C',
        1: 'Melting_Point_Minimum_°C',
        2: 'Flash_Point_Minimum_°C',
        3: 'Vapour_Pressure_25°C_mmHg',
        4: 'Density_25°C_Minimum_kg/L',
        5: 'Viscosity_25°C_Minimum_mPa.s',
        6: 'Autoignition_Temperature_Minimum_°C',
        7: 'Hansen_Delta_D_MPa1_2',
        8: 'Hansen_Delta_P_MPa1_2',
        9: 'Hansen_Delta_H_MPa1_2',
        10: 'Solubility_Water_g/L',
        11: 'Dielectric_Constant_20°C'
    }
});