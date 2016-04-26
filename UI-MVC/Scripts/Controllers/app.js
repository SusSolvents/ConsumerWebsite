var app = angular.module('sussol', ['ngRoute', 'ngMessages']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
        controller: 'homeController',
        templateUrl: "Content/Views/Home.html",
        authenticate: false
    });
    $routeProvider.when("/register", {
        templateUrl: "Content/Views/Account/Register.html",
        authenticate: false
    });
    $routeProvider.when("/login", {
        templateUrl: "Content/Views/Account/Login.html",
        authenticate: false
    });
    $routeProvider.when("/account/:id", {
        templateUrl: "Content/Views/Account/Home.html",
        authenticate: true 
    });
    $routeProvider.when("/organisation/create", {
        templateUrl: "Content/Views/Organisation/Create.html", 
        authenticate: true
    });
    $routeProvider.when("/organisation/:name", {
        templateUrl: "Content/Views/Organisation/Home.html",
        authenticate: true
    });
    $routeProvider.when("/analysis/start", {
        templateUrl: "Content/Views/Analysis/Start.html",
        authenticate: true
    });
    $routeProvider.when("/404", {
        templateUrl: "Content/Views/Error.html",
        authenticate: false
    });
    $routeProvider.otherwise({ redirectTo: "/" });

    $locationProvider.html5Mode(true);
});


app.controller('homeController', 
    function ($timeout, $window, $rootScope, $scope, AuthenticationService) {

        if (window.location.hash) {
            $('html, body').stop().animate({
                scrollTop: ($(window.location.hash).offset().top - 60)
            }, 2950, 'easeInOutExpo');

        }
        
        $timeout(function () {
            $('a.page-scroll').bind('click', function (event) {
                var $ele = $(this);
                if ($($ele.attr('href')).offset() !== undefined) {
                    $('html, body').stop().animate({
                        scrollTop: ($($ele.attr('href')).offset().top - 60)
                    }, 2950, 'easeInOutExpo');
                    event.preventDefault();
                }
            });

        });
        
        $("#js-rotating").Morphext({
            animation: "fadeInLeft",
            separator: ",",
            speed: 4000
        });
        var timelineBlocks = $('.cd-timeline-block'),
		offset = 0.8;

        //hide timeline blocks which are outside the viewport
        hideBlocks(timelineBlocks, offset);

        //on scolling, show/animate timeline blocks when enter the viewport
        $(window).on('scroll', function () {
            (!window.requestAnimationFrame)
                ? setTimeout(function () { showBlocks(timelineBlocks, offset); }, 100)
                : window.requestAnimationFrame(function () { showBlocks(timelineBlocks, offset); });
        });

        function hideBlocks(blocks, offset) {
            blocks.each(function () {
                ($(this).offset().top > $(window).scrollTop() + $(window).height() * offset) && $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
            });
        }

        function showBlocks(blocks, offset) {
            blocks.each(function () {
                ($(this).offset().top <= $(window).scrollTop() + $(window).height() * offset && $(this).find('.cd-timeline-img').hasClass('is-hidden')) && $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
            });
        }
        
    });

angular.bootstrap(document.body, ['sussol']);


app.run(['$rootScope', '$location', 'AuthenticationService', '$window', function ($rootScope, $location, AuthenticationService,  $window) {
    $rootScope.$on('$routeChangeStart', function (event, tostate) {
        $rootScope.username = $window.sessionStorage.username;
        $rootScope.userId = $window.sessionStorage.userId;
        if ($window.sessionStorage.username !== undefined) {
            AuthenticationService.isLogged = true;
        }
        if (tostate.authenticate && !AuthenticationService.isLogged) {
            console.log('DENY');
            event.preventDefault();
            $location.path('/');
            $('#login-modal').modal('show');
        }
        else {
            console.log('ALLOW');
        }
    });
}]);