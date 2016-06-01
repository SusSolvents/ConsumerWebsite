angular.module('sussol.controllers')
    .controller('OrganisationController',
    function ($timeout, $window, $scope, $http, fileReader, $route, $location, result, analysesOrganisation, membersOrganisation, organiserOrganisation) {

        var organisation = result.data;
        var analyses = analysesOrganisation.data;
        var members = membersOrganisation.data;
        var organiser = organiserOrganisation.data;
        $scope.organisation = organisation;
        $scope.noAnalyses = true;
        $scope.totalAnalyses = analyses.length;
        if (analyses.length !== 0) {
            $scope.noAnalyses = false;
            $scope.analyses = analyses;
        }
        setImageUrlsMembers();



        $scope.organiser = false;
        if ($window.sessionStorage.userId === organisation.OrganisatorId.toString()) {
            $scope.organiser = true;
        }

        if (organiser.AvatarUrl !== null && organiser.AvatarUrl !== "") {
            organiser.AvatarUrl = 'Content/Images/Users/' + organiser.AvatarUrl;
        }
        $scope.organiserUser = organiser;


        $scope.slideShow = setInArrayOf6(analyses);

        $scope.selectAnalysis = function selectAnalysis($event) {
            $location.path("/analysis/overview/" + $event.currentTarget.id);
        }
        $('.carousel').carousel("pause");
        function setInArrayOf6(items) {
            var item = [];
            var counter = 0;
            for (var i = 0; i < items.length; i += 6) {
                item[counter] = [];
                for (var j = 0; j < 6; j++) {
                    if (items[i + j] !== undefined) {
                        item[counter][j] = items[i + j];
                    }
                }
                counter += 1;
            }
            return item;
        }


        function setImageUrlsMembers() {
            for (var i = 0; i < members.length; i++) {
                if (members[i].AvatarUrl !== "" && members[i].AvatarUrl !== null) {
                    members[i].AvatarUrl = "/Content/Images/Users/" + members[i].AvatarUrl;
                }
            }
        }

        function createProgress() {
            jQuery("#circle-members").empty();
            jQuery("#circle-members").radialProgress("init", {
                'size': 120,
                'fill': 18,
                'font-size': 35,
                'font-family': "Questrial",
                "color": "#FF0D0D"
            }).radialProgress("to", { 'perc': (members.length / 20) * 100, 'time': 1000 });
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
                return interval + " yrs";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval > 1) {
                return interval + " mnths";
            }
            interval = Math.floor(seconds / 86400);
            if (interval > 1) {
                return interval + " dys";
            }
            interval = Math.floor(seconds / 3600);
            if (interval > 1) {
                return interval + " hrs";
            }
            interval = Math.floor(seconds / 60);
            if (interval > 1) {
                return interval + " min";
            }
            return Math.floor(seconds) + " sec";
        }

        function getRandomImage() {
            var number = Math.floor((Math.random() * 4) + 1);
            return "/Content/Images/random" + number + ".jpg";
        }



        $scope.clearNewMember = function() {
            delete $scope.messageNewMember;
            $scope.emailNewMember = "";
        }

        $scope.members = members;

        $scope.membersSlide = setInArrayOf6(members);


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
                setImageUrlsMembers();
                $scope.members = data;
                $scope.membersSlide = setInArrayOf6(members);
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

        $scope.closeModalOrganisation = function () {
            $('#delete-organisation').modal('hide');
        }

        $scope.closeModalLeave = function () {
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
                reloadMembers();
                notie.alert(1, "User was added to organisation", 2);
                $scope.emailNewMember = "";

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
            if (data.length !== 0) {
                createChart("chartCont-solv", json, "line", "Number of analyses", "#25DA45");
            };

        });


        //Load activity per user within organisation
        $http({
            method: 'GET',
            url: 'api/Organisation/GetActivityPerUser',
            params: { id: organisation.Id }
        }).success(function (data) {
            var json = [];
            for (var i = 0; i < data.length; i++) {
                json.push({ 'y': data[i].NumberOfUserAnalyses, 'indexLabel': data[i].User.Firstname });
            }
            if (data.length !== 0) {
                createChart("chartCont-usract", json, "pie", "", null);
            }
        });

        function createChart(id, json, type, title, color) {
            var chart = new CanvasJS.Chart(id,
            {
                theme: "theme3",

                backgroundColor: "rgba(60,60,60,1)",
                animationEnabled: true,
                axisX: {
                    valueFormatString: "MMM",
                    interval: 1,
                    intervalType: "month"

                },
                axisY: {
                    title: title,
                    titleFontColor: "gray"
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

angular.module('sussol.controllers')
    .controller('CreateOrganisationController',
    function ($window, $scope, $http, fileReader, $rootScope) {
        var model = this;
        var process = 0;
        model.org = {
            name: "",
            logo: ""
        };
        getUserInfo($window.sessionStorage.userId);

        $rootScope.resetOrganisationForm = function() {
            model.org = {
                name: "",
                logo: ""
            };
            process = 0;
            angular.element(document.querySelector('#progressBar .progress-bar')).css("width", process + "%").attr("aria-valuenow", process);
            delete $scope.message;
        }

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

                $scope.organisationRegistered = true;
            }).error(function errorCallback(data) {
                $scope.organisationRegistered = false;
                $scope.message = data.Message;
            });
        };

        function getUserInfo(id) {
            $http({
                method: 'GET',
                url: 'api/Account/GetUserInfo',
                params: { id: id }
            }).success(function (data, status, headers, conf) {
                if (data.HasOrganisation) {
                    $scope.organisationRegistered = true;
                } else {
                    $scope.organisationRegistered = false;
                }
            });
        };
        
        $scope.setName = function setName() {

            if (model.org.name === "" || model.org.name === undefined) {

                process = process - 40;
                angular.element(document.querySelector('#progressBar .progress-bar')).css("width", process + "%").attr("aria-valuenow", process);
            } else {

                if (process === 60 || process === 0)
                    process = process + 40;
                angular.element(document.querySelector('#progressBar .progress-bar')).css("width", process + "%").attr("aria-valuenow", process);
            }

        }


        model.submit = function (isValid) {
            if (isValid) {
                createOrganisation(model, $http);
            } else {
                $scope.message = "Fill in a name and select your logo";
            }
        };

        $scope.triggerUpload = function () {
            $("#logoImage").click();
        };
        $scope.getFile = function () {
            $scope.progress = 0;
            fileReader.readAsDataUrl($scope.file, $scope)
                          .then(function (result) {
                              model.org.logo = result;
                              $scope.logoSrc = result;
                              if (process === 0 || process === 40) {
                                  process += 60;
                                  angular.element(document.querySelector('#progressBar .progress-bar')).css("width", process + "%").attr("aria-valuenow", process);
                              }
                          });

        };
    });