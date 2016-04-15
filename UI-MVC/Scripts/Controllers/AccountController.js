(function () {

    var app = angular.module('validation', ['ngMessages', 'ngRoute', 'LocalStorageModule']);

    app.run(['authService', function (authService) {
        authService.fillAuthData();
    }]);



    var RegistrationController = function ($scope, $http) {
        var model = this;

        model.message = "";

        model.user = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            confirmPassword: ""
        };

        var registration = function (model, $http) {
            $http.post("../api/Account/Register?firstname=" + model.user.firstname + "&lastname=" + model.user.lastname + "&email=" + model.user.email + "&password=" + model.user.password + "&picture=a").then(function (response) { $scope.details = reponse });
        }

        model.submit = function (isValid) {
            console.log("h");
            if (isValid) {
                registration(model, $http);
                model.message = $scope.details;
            } else {
                model.message = "There are still invalid fields below";
            }
        };

    };



    var compareTo = function () {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    };

    app.directive("compareTo", compareTo);
    app.controller("RegistrationController", RegistrationController);
    app.factory('authService', ['$http', '$q', 'localStorageService', function ($http, $q, localStorageService) {

        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            userName: ""
        };

        var _login = function (loginData) {

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

            var deferred = $q.defer();

            $http.post('token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName });

                _authentication.isAuth = true;
                _authentication.userName = loginData.userName;

                deferred.resolve(response);

            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };

        var _logOut = function () {

            localStorageService.remove('authorizationData');

            _authentication.isAuth = false;
            _authentication.userName = "";

        };

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
            }

        }

        authServiceFactory.saveRegistration = regristation;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;

        return authServiceFactory;
    }]);

    app.controller('loginController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {
 
    $scope.loginData = {
        userName: "",
        password: ""
    };
 
    $scope.message = "";
 
    $scope.login = function () {
 
        authService.login($scope.loginData).then(function (response) {
 
            $location.path('/');
 
        },
         function (err) {
             $scope.message = err.error_description;
         });
    };
 
}]);

}());

