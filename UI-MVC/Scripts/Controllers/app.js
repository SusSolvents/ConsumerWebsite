var app = angular.module('sussol', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "Home.html"
    });

    $routeProvider.otherwise({ redirectTo: "/home" });
});

app.controller('homeController', function (){

});