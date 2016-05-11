app.controller('AdminController', function($scope, $rootScope, $http, fileReader, $routeParams, $location, result) {
    var data = result.data;
    console.log(data);
    notie.setOptions({
        colorSuccess: 'rgba(87,191,87,0.9)',
        colorText: '#FFFFFF',
        animationDelay: 300, 
        backgroundClickDismiss: true
    });
   
    for (var i = 0; i < data.BlockedUsers.length; i++) {
        if (data.BlockedUsers[i].AvatarUrl !== "" && data.BlockedUsers[i].AvatarUrl !== null) {
            data.BlockedUsers[i].AvatarUrl = "/Content/Images/Users/" + data.BlockedUsers[i].AvatarUrl;
        }
    }
    $scope.blockedUsers = data.BlockedUsers;
    $scope.allowUser = function(email, index) {
        $http({
            method: 'POST',
            url: 'api/Account/AllowUser',
            params: { email: email }
        }).success(function (data) {
            
            $scope.blockedUsers.splice(index, 1);
            notie.alert(1, data, 3.5);
        });
    }
    $scope.denyUser = function (email, index) {
        $http({
            method: 'POST',
            url: 'api/Account/DenyUser',
            params: { email: email }
        }).success(function (data) {
            console.log(data);
            $scope.blockedUsers.splice(index, 1);
            notie.alert(1, data, 3.5);
        });
    }
    //Load solvent cluster trend information
    $http({
        method: 'GET',
        url: 'api/Analysis/GetAnalysesByMonth'
    }).success(function (data) {
        console.log(data);
        var json = [];
        for (var i = 0; i < data.length; i++) {
            json.push({ 'x': new Date(new Date(data[i][0].DateCreated).getFullYear(), new Date(data[i][0].DateCreated).getMonth(),1), 'y': data[i].length });
        }
        
        createChart("chartCont", json, "line", "Number of solvent clusters", "#1BA5BF");
        
    });
    //Load User trend information
    $http({
        method: 'GET',
        url: 'api/Account/GetAllUsers'
    }).success(function (data) {
        console.log(data);
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
        console.log(data);
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
        console.log(numberAnalyses);
        var json = [];
        for (var i = 0; i < algorithmNames.length; i++) {
            json.push({'y': (algorithmTotals[i]/numberAnalyses) * 100, 'indexLabel' : algorithmNames[i]});
        }
        createChart("chartCont-algo", json, "doughnut", null, null);

    });
    
    function createChart(id, json, type, title, color)
    {
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

    
});