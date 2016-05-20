app.controller('AdminController', function($scope, $rootScope, $http, fileReader, $routeParams, $location, result) {
    var colors = [
            "#44B3C2",
            "#F1A94E",
            "#F2635F",
            "#32B92D",
            "#F20075",
            "#E0A025",

            "#0093D1"

        ];
        var data = result.data;
    for (var i = 0; i < data.BlockedUsers.length; i++) {
        if (data.BlockedUsers[i].AvatarUrl !== "" && data.BlockedUsers[i].AvatarUrl !== null) {
            data.BlockedUsers[i].AvatarUrl = "/Content/Images/Users/" + data.BlockedUsers[i].AvatarUrl;
        }
    }
    
    notie.setOptions({
        colorSuccess: 'rgba(87,191,87,0.9)',
        colorText: '#FFFFFF',
        animationDelay: 300, 
        backgroundClickDismiss: true
    });
           
    
    $scope.blockedUsers = data.BlockedUsers;
    $scope.allowUser = function(email, index) {
        $http({
            method: 'POST',
            url: 'api/Account/AllowUser',
            params: { email: email }
        }).success(function (data) {
            
            $scope.blockedUsers.splice(index, 1);
            notie.alert(1, data, 3.5);
            loadAllUsers();
        });
    }

    $scope.denyUser = function (email, index) {
        $http({
            method: 'POST',
            url: 'api/Account/DenyUser',
            params: { email: email }
        }).success(function (data) {
            $scope.blockedUsers.splice(index, 1);
            notie.alert(1, data, 3.5);
            loadAllUsers();
        });
    }
    //Load solvent cluster trend information
    $http({
        method: 'GET',
        url: 'api/Analysis/GetAnalysesByMonth'
    }).success(function (data) {
        var json = [];
        for (var i = 0; i < data.length; i++) {
            json.push({ 'x': new Date(new Date(data[i][0].DateCreated).getFullYear(), new Date(data[i][0].DateCreated).getMonth(),1), 'y': data[i].length });
        }
        
        createChart("chartCont", json, "line", "Number of solvent clusters", "#F41D47");
        
    });
    //Load User trend information
    $http({
        method: 'GET',
        url: 'api/Account/GetAllUsers'
    }).success(function (data) {
        var json = [];
        for (var i = 0; i < data.length; i++) {
            json.push({ 'x': new Date(new Date(data[i][0].DateRegistered).getFullYear(), new Date(data[i][0].DateRegistered).getMonth(), 1), 'y': data[i].length });
        }

        
        createChart("chartCont-user", json, "column", "Number of new users", "#FF951E");
    });
    //Load solvent cluster division
    $http({
        method: 'GET',
        url: 'api/Analysis/GetAnalysesDivision'
    }).success(function (data) {
        var algorithmNames = ['Canopy', 'EM', 'KMeans', 'SOM', 'XMeans'];
        var algorithmTotals = [];
        var numberAnalyses = 0;
        var canopyCounter = 0;
        var emCounter = 0;
        var kmeansCounter = 0;
        var somCounter = 0;
        var xmeansCounter = 0;
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].AnalysisModels.length; j++) {
                numberAnalyses++;
                switch (data[i].AnalysisModels[j].Model.AlgorithmName) {
                    case 0:
                        canopyCounter++; break;
                    case 1:
                        emCounter++; break;
                    case 2:
                        kmeansCounter++; break;
                    case 3:
                        somCounter++; break;
                    case 4:
                        xmeansCounter++; break;
                }
            }
        }
        algorithmTotals.push(canopyCounter);
        algorithmTotals.push(emCounter);
        algorithmTotals.push(kmeansCounter);
        algorithmTotals.push(somCounter);
        algorithmTotals.push(xmeansCounter);
        var json = [];
        for (var i = 0; i < algorithmNames.length; i++) {
            if (((algorithmTotals[i] / numberAnalyses) * 100) !== 0) {
                json.push({ 'y': (algorithmTotals[i] / numberAnalyses) * 100, 'indexLabel': algorithmNames[i], 'color':colors[i] });
            }
            
        }
        $scope.totalSolventClusters = data.length;
        $scope.totalOrganisations = 0;
        createChart("chartCont-algo", json, "doughnut", null, null);

    });

    loadAllUsers();
    //Load all users
    function loadAllUsers() {
        $http({
            method: 'GET',
            url: 'api/Account/GetAllUsersForAdmin'
        }).success(function (data) {
            $scope.users = data;
        });
    }


    $scope.changeUser = function (user) {
        if (!user.LockoutEnabled) {
            unBlockUser(user.Email);
        }
        if (user.LockoutEnabled) {
            blockUser(user.Email);
        }
    }

    function unBlockUser (email) {
        $http({
            method: 'POST',
            url: 'api/Account/AllowUser',
            params: { email: email }
        }).success(function (data) {
            notie.alert(1, data, 2);
        });
    }

    function blockUser(email) {
        $http({
            method: 'POST',
            url: 'api/Account/DenyUser',
            params: { email: email }
        }).success(function (data) {
            notie.alert(1, data, 2);
        });
    }

    //Load all organisations
    var newOrganisations;
    getOrganisations();
    function getOrganisations() {
        $http({
            method: 'GET',
            url: 'api/Organisation/GetAllOrganisations'
        }).success(function(data) {
            newOrganisations = [];
            $scope.organisationModels = data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].Organisation.DateCreated === null) {
                    if (data[i].Organisation.LogoUrl !== "" && data[i].Organisation.LogoUrl !== null) {
                        data[i].Organisation.LogoUrl = "/Content/Images/Organisations/" + data[i].Organisation.LogoUrl;
                    }
                    newOrganisations.push(data[i]);
                }
            }
            $scope.newOrganisations = newOrganisations;
        });
    }

    $scope.allowOrganisation = function (id, index) {
        unBlockOrganisation(id);
        $scope.newOrganisations.splice(index, 1);
        getOrganisations();
    }

    $scope.denyOrganisation = function (id, index) {
        blockOrganisation(id);
        $scope.newOrganisations.splice(index, 1);
        getOrganisations();
    }


    //Allow Organisation
    function unBlockOrganisation(id) {
        $http({
            method: 'POST',
            url: 'api/Organisation/AllowOrganisation',
            params: { id: id }
        }).success(function succesCallback() {
            notie.alert(1, "The organisation has been allowed", 2);
        });
        $http({
            method: 'POST',
            url: 'api/Account/AllowUsersForOrganisation',
            params: { id: id }
        }).success(function succesCallback() {
            loadAllUsers();
        });
    }

    //Block organisation
    function blockOrganisation (id) {
        $http({
            method: 'POST',
            url: 'api/Organisation/BlockOrganisation',
            params: { id: id }
        }).success(function succesCallback() {
            notie.alert(1, "The organisation has been blocked", 2);
        });
        $http({
            method: 'POST',
            url: 'api/Account/BlockUsersForOrganisation',
            params: { id: id }
        }).success(function succesCallback() {
            loadAllUsers();
        });
    }

    $scope.closeModal = function() {
        $('#delete-organisation').modal('hide');
    }

    $scope.changeOrganisation = function (organisation) {
        if (!organisation.Blocked) {
            unBlockOrganisation(organisation.Id);
        }
        if (organisation.Blocked) {
            blockOrganisation(organisation.Id);
        }
    }



    function createChart(id, json, type, title, color)
    {
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
                includeZero: false,
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
                bevelEnabled: false,
                lineThickness: 3,
                
                dataPoints: json
            }


            ]
        });

        chart.render();
    }

    
});