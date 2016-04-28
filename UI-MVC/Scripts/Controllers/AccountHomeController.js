﻿app.controller('AccountHomeController', function ($scope, $rootScope, $http, fileReader, $routeParams, $location) {
    $http({
        method: 'GET',
        url: 'api/Account/GetUserInfo?id=' + $routeParams.id
        }).success(function succesCallback(data) {
            
            $scope.firstname = data.Firstname;
            $scope.lastname = data.Lastname;
            $scope.id = data.Id;
            var picture = data.Picture;
            if (picture != null && picture !== "") {
                $scope.imageSrc = '/Content/Images/Users/' + picture;
            }
        //$location.path("/");
    }).error(function errorCallback(data) {
        $location.url('/404');
    });
    $scope.noOrganisations = true;
    $scope.noAnalyses = true;
    var organisations;

    $http({
        method: 'POST',
        url: 'api/Organisation/ReadOrganisations',
        params: {email : $rootScope.username }  
    }).success(function succesCallback(data) {
        organisations = data;
        $scope.organisations = data;
        if (data.length !== 0) {
            $scope.noOrganisations = false;
        }
    });

    var analyses;
    $http({
        method: 'GET',
        url: 'api/Analysis/GetAnalysesForUser',
        params: { email: $rootScope.username }
    }).success(function succesCallback(data) {
        
        analyses = data;
        var i;
        for (i = 0; i < data.length; i++) {
            console.log(data[i].DateCreated);
            
            data[i].DateCreated = timeSince(new Date(Date.parse(analyses[i].DateCreated +"+0200")));
        }
        
        $scope.analyses = data;
        console.log(data);
        if (data.length !== 0) {
            $scope.noAnalyses = false;
        }
    });

    function timeSince(date) {
        console.log(date);
        var seconds = Math.floor((new Date() - date) / 1000);
        console.log(seconds);
        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }


    $('ul.tabs li').click(function() {
        var tab_id = $(this).attr('data-tab');

        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    });

    $scope.selectAnalysis = function selectAnalysis($event) {
        $location.path("/analysis/overview/" + $event.currentTarget.id);
    }
    
    $scope.triggerUpload = function () {
        $("#profileImage").click();
    };
    $scope.getFile = function () {
        fileReader.readAsDataUrl($scope.file, $scope)
                      .then(function (result) {
                          $scope.imageSrc = result;
                          var formData = new FormData();
                          formData.append('email', $rootScope.username);
                          formData.append('picture', $scope.file);
                $http({
                    method: 'POST',
                    url: 'api/Account/ChangeAvatar',
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity,
                    data: formData
                }).success(function succesCallback(data) {
                    //$scope.message = data;
                    //$location.path("/");
                }).error(function errorCallback(data) {
                    //$scope.message = data;
                });
            });
    };
    var model = this;
    model.password = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    };
    var changePassword = function (model, $http) {
        var formData = new FormData();
        formData.append('newPassword', model.password.newPassword);
        formData.append('confirmNewPassword', model.password.confirmPassword);
        formData.append('password', model.password.currentPassword);

        $http({
            method: 'POST',
            url: 'api/Account/ChangePassword?currentPassword=' + model.password.currentPassword + '&newPassword=' + model.password.newPassword
        }).success(function succesCallback(data) {
            $scope.success = data;
           
            setTimeout(function() {
                $('#password-modal').modal('hide');
                $scope.account.password.currentPassword = null;
                $scope.account.password.newPassword = null;
                $scope.account.password.confirmPassword = null;
            },2000);
            
            //$location.path("/");
        }).error(function errorCallback(data) {
            $scope.message = data;
        });

    }


    model.submit = function (isValid) {
        if (isValid) {
            changePassword(model, $http);
        } else {
            $scope.message = "There are still invalid fields below";
        }
    };
});
