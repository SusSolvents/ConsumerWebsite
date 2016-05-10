var app = angular.module('sussol', ['ngRoute', 'ngMessages', "angucomplete-alt", 'sussol.services', 'sussol.controllers']);

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
        controller: 'AccountHomeController as account',
        authenticate: true,
        resolve: {
            result: function ($route, srvLibrary) {
                return srvLibrary.getUserInfo($route.current.params.id);
            },
            organisationsResult: function($route, srvLibrary) {
                return srvLibrary.readOrganisations($route.current.params.id);
            },
            analysesResult: function($route, srvLibrary) {
                return srvLibrary.readAnalyses($route.current.params.id);
            }
        }
    });
    $routeProvider.when("/organisation/create", {
        templateUrl: "Content/Views/Organisation/Create.html", 
        authenticate: true
    });
    $routeProvider.when("/organisation/:id", {
        templateUrl: "Content/Views/Organisation/Home.html",
        controller: 'OrganisationController',
        authenticate: true,
        resolve: {
            result: function ($route, srvLibrary) {
                return srvLibrary.readOrganisation($route.current.params.id);
            },
            membersOrganisation: function($route, srvLibrary) {
                return srvLibrary.readUsersForOrganisation($route.current.params.id);
            },
            analysesOrganisation: function($route, srvLibrary) {
                return srvLibrary.readAnalysesForOrganisation($route.current.params.id);
            }
        }
    });
    $routeProvider.when("/analysis/start", {
        templateUrl: "Content/Views/Analysis/Start.html",
        authenticate: true
    });
    $routeProvider.when("/analysis/overview/:id", {
        templateUrl: "Content/Views/Analysis/Overview.html",
        controller: 'AnalysisOverviewController',
        authenticate: true,
        resolve: {
            result: function ($route, srvLibrary) {
                return srvLibrary.getSolventClusterResult($route.current.params.id);
            }
        }
    });
    $routeProvider.when("/404", {
        templateUrl: "Content/Views/Error.html",
        authenticate: false
    });
    $routeProvider.otherwise({ redirectTo: "/" });

    $locationProvider.html5Mode(true);

});

angular.module('sussol.services')
    .factory('srvLibrary', ['$http', '$location', function($http, $location) {
            var services = {
                getSolventClusterResult: function(id) {
                    var promise = $http({
                        method: 'GET',
                        url: 'api/Analysis/GetAnalysis',
                        params: { id: id }
                    });
                    promise.success(function(data, status, headers, conf) {
                        return data;
                    });
                    return promise;
                },
                getUserInfo: function(id) {
                    var promise = $http({
                        method: 'GET',
                        url: 'api/Account/GetUserInfo',
                        params: { id: id }
                    }).error(function errorCallback(data) {
                        $location.path("/404");
                    });
                    promise.success(function(data, status, headers, conf) {
                        return data;
                    });
                    return promise;
                },
                readOrganisations: function(id) {
                    var promise = $http({
                        method: 'POST',
                        url: 'api/Organisation/ReadOrganisations',
                        params: { id: id }
                    });
                    promise.success(function(data, status, headers, conf) {
                        return data;
                    });
                    return promise;
                },
                readOrganisation: function(id) {
                    var promise = $http({
                        method: 'POST',
                        url: 'api/Organisation/ReadOrganisation',
                        params: { id: id }
                    });
                    promise.success(function(data, status, headers, conf) {
                        return data;
                    });
                    return promise;
                },
                readAnalyses: function(id) {
                    var promise = $http({
                        method: 'GET',
                        url: 'api/Analysis/GetAnalysesForUser',
                        params: { id: id }
                    });
                    promise.success(function(data, status, headers, conf) {
                        return data;
                    });
                    return promise;
                },
                readAnalysesForOrganisation: function(id) {
                    var promise = $http({
                        method: 'GET',
                        url: 'api/Organisation/GetAnalysesForOrganisation',
                        params: { id: id }
                    });
                    promise.success(function(data, status, headers, conf) {
                        return data;
                    });
                    return promise;
                },
                readUsersForOrganisation: function (id) {
                    var promise = $http({
                        method: 'GET',
                        url: 'api/Organisation/GetUsersForOrganisation',
                        params: { id: id }
                    });
                    promise.success(function (data, status, headers, conf) {
                        return data;
                    });
                    return promise;
                }
            }
            return services;
        }
    ]);



app.run([
    '$rootScope', function($root) {
        $root.$on('$routeChangeStart', function(e, curr, prev) {
            if (curr.$$route && curr.$$route.resolve) {
                // Show a loading message until promises aren't resolved
                
                $root.loadingView = true;
            }
        });
        $root.$on('$routeChangeSuccess', function(e, curr, prev) {
            // Hide loading message
            $root.loadingView = false;
        });
    }
]);


app.controller('homeController', 
    function ($timeout) {

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
            speed: 9000
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

app.run([
    '$rootScope', '$location', 'AuthenticationService', '$window', function($rootScope, $location, AuthenticationService, $window) {
        $rootScope.$on('$routeChangeStart', function (event, tostate) {
            
            $rootScope.username = $window.sessionStorage.username;
            $rootScope.userId = $window.sessionStorage.userId;
            if ($window.sessionStorage.username !== undefined) {
                AuthenticationService.isLogged = true;
            }
            if (tostate.authenticate && !AuthenticationService.isLogged) {
                event.preventDefault();
                $location.path('/');
                $('#login-modal').modal('show');
            }

        });
    }
]);