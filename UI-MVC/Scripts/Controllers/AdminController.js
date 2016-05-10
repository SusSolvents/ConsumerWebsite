﻿app.controller('AdminController', function($scope, $rootScope, $http, fileReader, $routeParams, $location, result) {
    var data = result.data;
    console.log(data);

    for (var i = 0; i < data.BlockedUsers.length; i++) {
        if (data.BlockedUsers[i].AvatarUrl !== "" && data.BlockedUsers[i].AvatarUrl !== null) {
            data.BlockedUsers[i].AvatarUrl = "/Content/Images/Users/" + data.BlockedUsers[i].AvatarUrl;
        }
    }
    $scope.blockedUsers = data.BlockedUsers;
    $scope.allowUser = function(email) {
        $http({
            method: 'POST',
            url: 'api/Account/AllowUser',
            params: { email: email }
        }).success(function (data) {
            console.log(data);
        });
    }
});