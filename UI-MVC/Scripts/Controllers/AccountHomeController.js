app.controller('AccountHomeController', function ($scope, $rootScope, $http, fileReader) {
    $http({
        method: 'GET',
        url: 'api/Account/GetUserInfo?email=' + $rootScope.username
    }).success(function succesCallback(data) {
        $scope.firstname = data.Firstname;
        $scope.lastname = data.Lastname;
        var picture = data.Picture;
        
        if (picture != null && picture !== "") {
            $scope.imageSrc = '/Content/Images/Users/' + picture;
        }
        //$location.path("/");
    }).error(function errorCallback(data) {
        console.log("errotje");
    });

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
            $scope.message = data;
            $scope.account.password.currentPassword = null;
            $scope.account.password.newPassword = null;
            $scope.account.password.confirmPassword = null;
            //$location.path("/");
        }).error(function errorCallback(data) {
            $scope.message = data;
        });

    }
    var organisations;
    var getOrganisations = function($http) {
        $http({
            method: 'GET',
            url: 'api/Organisation/ReadOrganisations?email=' + $rootScope.username
        }).success(function succesCallback(data) {
            organisations = data;
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
