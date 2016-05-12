app.controller('OrganisationController',
    function ($timeout, $window, $scope, $http, fileReader, $route, $location, result, analysesOrganisation, membersOrganisation) {

        var organisation = result.data;
        var analyses = analysesOrganisation.data;
        var members = membersOrganisation.data;
        $scope.organisation = organisation;
        $scope.noAnalyses = true;

        if (analyses.length !== 0) {
            $scope.noAnalyses = false;
            $scope.analyses = analyses;
        }

        $scope.organiser = false;
        if ($window.sessionStorage.userId === organisation.Organisator.Id.toString()) {
            $scope.organiser = true;
        }

        $scope.slideShow = setInArrayOf5(analyses);

        $scope.selectAnalysis = function selectAnalysis($event) {
            $location.path("/analysis/overview/" + $event.currentTarget.id);
        }
        $('.carousel').carousel("pause");
        function setInArrayOf5(items) {
            var item = [];
            var counter = 0;
            for (var i = 0; i < items.length; i += 4) {
                item[counter] = [];
                for (var j = 0; j < 4; j++) {
                    if (items[i + j] !== undefined) {
                        item[counter][j] = items[i + j];
                    }
                }
                counter +=1;
            }
            return item;
        }


        function createProgress() {
            jQuery("#circle-members").empty();
            jQuery("#circle-members").radialProgress("init", {
                'size': 90,
                'fill': 12,
                'font-size': 25,
                'font-family': "Questrial",
                "color": "#44B3C2"
            }).radialProgress("to", { 'perc': (members.length / 4) * 100, 'time': 1000 });
        };

        createProgress();
        for (var i = 0; i < analyses.length; i++) {
            analyses[i].image = getRandomImage();
            analyses[i].DateCreated = timeSince(new Date(Date.parse(analyses[i].DateCreated + "+0200")));
        }

        function timeSince(date) {
            var seconds = Math.floor((new Date() - date) / 1000);
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

        function getRandomImage() {
            var number = Math.floor((Math.random() * 4) + 1);
            return "/Content/Images/random" + number + ".jpg";
        }

        for (var i = 0; i < members.length; i++) {
            if (members[i].AvatarUrl !== "" && members[i].AvatarUrl !== null) {
                members[i].AvatarUrl = "/Content/Images/Users/" + members[i].AvatarUrl;
            }
        }

        $scope.members = members;

        var logo = organisation.LogoUrl;
        if (logo != null && logo !== "") {
            $scope.imageSrc = 'Content/Images/Organisations/' + logo;
        } else {
            $scope.imageSrc = 'Content/Images/organisationLogo.jpg';
        }

        function reloadMembers() {
            $http({
                method: 'GET',
                url: 'api/Organisation/GetUsersForOrganisation',
                params: { id: organisation.Id }
            }).success(function succesCallback(data) {
                members = data;
                $scope.members = data;
                createProgress();
            });
        }

        $scope.DeleteOrganisation = function () {
            $('#delete-organisation').modal('hide');
            $http({
                method: 'DELETE',
                url: 'api/Organisation/DeleteOrganisation',
                params: { id: organisation.Id }
            }).success(function succesCallback() {
                notie.alert(1, "The organisation has been removed", 2);
                $('body').removeClass('modal-open');
                $location.path("/account/" + $window.sessionStorage.userId);
            });
        }

        $scope.closeModal = function () {
            $('#leave-modal').modal('hide');
        }

        $scope.LeaveOrganisation = function () {
            $('#leave-modal').modal('hide');
            $http({
                method: 'POST',
                url: 'api/Organisation/LeaveOrganisation',
                params: { userId: $window.sessionStorage.userId, organisationId: organisation.Id }
            }).success(function succesCallback() {
                notie.alert(1, "You left the organisation", 2);
                $('body').removeClass('modal-open');
                $location.path("/account/" + $window.sessionStorage.userId);

            });
        }

        $scope.AddMember = function () {
            $http({
                method: 'POST',
                url: 'api/Organisation/AddMemberToOrganisation',
                params: { organisationId: organisation.Id, email: $scope.emailNewMember }
            }).success(function succesCallback(data) {

                notie.alert(1, "User was added to organisation", 2);
                $scope.emailNewMember = "";
                reloadMembers();
                $('#add-member-modal').modal('hide');
            }).error(function errorCallback(data) {
                $scope.messageNewMember = data.Message;
            });

        }

        //Load solvent cluster trend information
        $http({
            method: 'GET',
            url: 'api/Organisation/GetAnalysesByMonthForOrganisation',
            params: { id: organisation.Id }
        }).success(function (data) {
            var json = [];
            for (var i = 0; i < data.length; i++) {
                json.push({ 'x': new Date(new Date(data[i][0].DateCreated).getFullYear(), new Date(data[i][0].DateCreated).getMonth(), 1), 'y': data[i].length });
            }

            createChart("chartCont", json, "line", "Number of solvent clusters", "#1BA5BF");

        });


        function createChart(id, json, type, title, color) {
            var chart = new CanvasJS.Chart(id,
            {
                theme: "theme3",

                backgroundColor: "rgba(80,80,80,1)",
                animationEnabled: true,
                axisX: {
                    valueFormatString: "MMM",
                    interval: 1,
                    intervalType: "month"

                },
                axisY: {
                    title: title

                },

                data: [
                {
                    type: type,
                    indexLabelFontSize: 15,
                    indexLabelPlacement: "outside",
                    indexLabelFontColor: "darkgrey",
                    indexLabelLineColor: "darkgrey",
                    color: color,

                    lineThickness: 3,

                    dataPoints: json
                }


                ]
            });

            chart.render();
        }




        $scope.triggerUpload = function () {
            $("#logo").click();
        };
        $scope.getFile = function () {
            fileReader.readAsDataUrl($scope.file, $scope)
                          .then(function (result) {
                              $scope.imageSrc = result;
                              var formData = new FormData();
                              formData.append('id', organisation.Id);
                              formData.append('logo', $scope.file);
                              $http({
                                  method: 'POST',
                                  url: 'api/Organisation/ChangeLogo',
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