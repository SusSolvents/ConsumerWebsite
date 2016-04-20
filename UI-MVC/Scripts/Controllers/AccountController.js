    var RegistrationController = function($scope, $http, $location, fileReader) {
        var model = this;

        model.message = "";

        model.user = {
            firstname: "",
            lastname: "",
            picture: "",
            email: "",
            password: "",
            confirmPassword: ""
        };

        $scope.triggerUpload = function () {
            $("#profileImage").click();
        };
        console.log(fileReader);
        $scope.getFile = function () {
            $scope.progress = 0;
            fileReader.readAsDataUrl($scope.file, $scope)
                          .then(function (result) {
                              $scope.imageSrc = result;
                          });
        };

        $scope.$on("fileProgress", function (e, progress) {
            $scope.progress = progress.loaded / progress.total;
        });




        var registration = function (model, $http) {
            var formData = new FormData();
            formData.append('firstname', model.user.firstname);
            formData.append('lastname', model.user.lastname);
            formData.append('email', model.user.email);
            formData.append('password', model.user.password);
            formData.append('picture', $scope.file);

            $http({
                method: 'POST',
                url: 'api/Account/Register',
                headers: {
                    'Content-Type': undefined
                },transformRequest: angular.identity,
                data: formData
            }).success(function succesCallback(data) {
                model.message = data;
                //$location.path("/");
            }).error(function errorCallback(data) {
                model.message = data;
            }).catch (function(error) {
                model.message = error;
            });

        }

        model.submit = function(isValid) {
            if (isValid) {
                registration(model, $http);
                model.message = $scope.details;
            } else {
                model.message = "There are still invalid fields below";
            }
        };

    };


    var compareTo = function() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    };

    app.directive("compareTo", compareTo);
    app.controller("RegistrationController", RegistrationController);
    
    app.directive("ngFileSelect", function () {

        return {
            link: function ($scope, el) {

                el.bind("change", function (e) {

                    $scope.file = (e.srcElement || e.target).files[0];
                    $scope.getFile();
                });

            }

        }
    });