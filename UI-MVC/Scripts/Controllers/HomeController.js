(function () {

    var app = angular.module('sussol', ['ngRoute']);

    app.config(['$routeProvider', function ($routeProvder) {
        $routeProvder.when('/Register', {
            templateUrl: 'Home/Register'
        });
        $routeProvder.when('/', {
            templateUrl: 'Home/Start'
        });
        $routeProvder.otherwise({
            redirectTo: '/'
        });
    }]);
    
    app.controller('Home', ['$scope',
        function () {

        }]);
}());