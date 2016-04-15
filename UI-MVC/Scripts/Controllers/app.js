var app = angular.module('sussol', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
        controller: "homeController",
        templateUrl: "Content/Views/Home.html"
    });
    $routeProvider.otherwise({ redirectTo: "/" });

    $locationProvider.html5Mode(true);
});

app.controller('homeController', function (){

});
