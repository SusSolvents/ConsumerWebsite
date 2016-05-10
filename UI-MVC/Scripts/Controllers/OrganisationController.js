app.controller('OrganisationController', 
    function ($window, $scope, $http, fileReader, $location, result, analysesOrganisation, membersOrganisation) {

        var organisation = result.data;
        var analyses = analysesOrganisation.data;
        var members = membersOrganisation.data;
        $scope.organisation = organisation;
        
        $scope.noAnalyses = true;

        if (analyses.length !== 0) {
            $scope.noAnalyses = false;
            $scope.analyses = analyses;
        }

        

        for (var i = 0; i < members.length; i++) {
            if (members[i].AvatarUrl !== "") {
                members[i].AvatarUrl = "/Content/Images/Users/" + members[i].AvatarUrl;
            }
        }

        $scope.members = members;

        var logo = organisation.LogoUrl;
        if (logo != null && logo !== "") {
            $scope.imageSrc = { 'background-image': 'url(/Content/Images/Organisations/' + logo + ')' }
        } else {
            $scope.imageSrc = { 'background-image': 'url(/Content/Images/organisationHeader.jpg)' }
        }

        
        $scope.AddMember = function() {
            $http({
                method: 'POST',
                url: 'api/Organisation/AddMemberToOrganisation',
                params: { organisationId: organisation.Id, email: $scope.emailNewMember }
            }).success(function succesCallback(data) {
                $scope.messageNewMember = "User was added to organisation";
                $scope.emailNewMember = "";
            }).error(function errorCallback(data) {
                $scope.messageNewMember = "Email address was not found";
            });
        }

        $scope.LeaveOrganisation = function() {
            $http({
                method: 'POST',
                url: 'api/Organisation/LeaveOrganisation',
                params: { userId: $window.sessionStorage.userId, organisationId: organisation.Id }
            }).success(function succesCallback() {
                $location.path("/account/" + $window.sessionStorage.userId);
            });
        }


        
    }
);

app.controller('CreateOrganisationController',
    function ($window, $scope, $http, fileReader, $location) {
        var model = this;
        model.org = {
            name: "",
            logo: ""
        };

        var createOrganisation = function (model, $http) {
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
                setTimeout($location.path("/organisation/" + data), 1000);
            }).error(function errorCallback(data) {
                $scope.message = data;
            });
        };


        model.submit = function (isValid) {
            if (isValid) {
                createOrganisation(model, $http);
            } else {
                $scope.message = "There are still invalid fields below";
            }
        };

        $scope.triggerUpload = function () {
            $("#profileImage").click();
        };
        $scope.getFile = function () {
            $scope.progress = 0;
            fileReader.readAsDataUrl($scope.file, $scope)
                          .then(function (result) {
                              $scope.imageSrc = result;
                          });
        };
    });