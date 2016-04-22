var app = angular.module('sussol', ['ngRoute', 'ngMessages']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
        controller: 'homeController',
        templateUrl: "Content/Views/Home.html"
    });
    $routeProvider.when("/register", {
        templateUrl: "Content/Views/Account/Register.html"
    });
    $routeProvider.when("/login", {
        templateUrl: "Content/Views/Account/Login.html"
    });
    $routeProvider.when("/account/:email", {
        templateUrl: "Content/Views/Account/Home.html"
    });
    $routeProvider.when("/organisation/create", {
        templateUrl: "Content/Views/Organisation/Create.html"
    });
    $routeProvider.when("/organisation/:name", {
        templateUrl: "Content/Views/Organisation/Home.html"
    });
    $routeProvider.otherwise({ redirectTo: "/" });

    $locationProvider.html5Mode(true).hashPrefix('*');
});


app.controller('homeController', 
    function ($timeout, $window, $rootScope) {
        $rootScope.username = $window.sessionStorage.username;

        $timeout(function () {
            $('a.page-scroll').bind('click', function (event) {
                var $ele = $(this);
                $('html, body').stop().animate({
                    scrollTop: ($($ele.attr('href')).offset().top - 60)
                }, 2950, 'easeInOutExpo');
                event.preventDefault();
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



