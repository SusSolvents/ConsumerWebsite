var app = angular.module('sussol', ['ngRoute', 'ngMessages']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
        controller: "homeController",
        templateUrl: "Content/Views/Home.html"
    });
    $routeProvider.when("/register", {
        templateUrl: "Content/Views/Account/Register.html"
    });
    $routeProvider.when("/login", {
        templateUrl: "Content/Views/Account/Login.html"
    });
    $routeProvider.otherwise({ redirectTo: "/" });

    $locationProvider.html5Mode(true);
});

app.controller('homeController', function (){

});
