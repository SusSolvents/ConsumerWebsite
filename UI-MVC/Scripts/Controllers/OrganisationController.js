app.controller('organisationController', 
    function ($window, $scope, $http, fileReader, $location) {
        $scope.username = $window.sessionStorage.username;
        var model = this;
        model.org = {
            name: "",
            logo: ""
        };

        var organisation;
        var getOrganisation = function (name, $http) {
            $http({
                method: 'GET',
                url: 'api/Organisation/ReadOrganisation?name=' + name
            }).succes(function succesCallback(data) {
                organisation = data;
            });
        };

        var createOrganisation = function(model, $http) {
            var formData = new FormData();
            formData.append('name', model.org.name);
            formData.append('email', $scope.username);
            formData.append('logo', $scope.file);

            $http({
                method: 'POST',
                url: 'api/Organisation/CreateOrganisation',
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity,
                data: formData
            }).success(function succesCallback(data) {
                $scope.message = data;
                $scope.organisationName = model.org.name;
                getOrganisation($scope.organisationName);
                $location.path("/organisation/" + $scope.organisationName);
            }).error(function errorCallback(data) {
                $scope.message = data;
            });
        };


        model.submit = function (isValid) {
            if (isValid) {
                console.log("Creatig organisation");
                createOrganisation(model, $http);
            } else {
                console.log("foutje");
                $scope.message = "There are still invalid fields below";
            }
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
    }
);