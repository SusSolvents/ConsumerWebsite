app.controller('AnalysisOverviewController',
    function($scope, $window, $http, $routeParams, Constants, result) {
        var solvents = [];
        var selectedAlgorithm;
        var clusters = [];
        var models = [];
        var chartArray = [];
        var algorithms = [];
        var data = result.data;
        
            for (var i = 0; i < data.AnalysisModels.length; i++) {
                data.AnalysisModels[i].Model.AlgorithmName = Constants.AlgorithmName[data.AnalysisModels[i].Model.AlgorithmName];
                algorithms.push(i, Constants.AlgorithmName[data.AnalysisModels[i].Model.AlgorithmName]);
            for (var j = 0; j < data.AnalysisModels[i].Model.Clusters.length; j++) {
                chartArray[j] = [j+"",10+ (j * 30), 0.5, "cluster", data.AnalysisModels[i].Model.Clusters[j].Solvents.length];
                //clusters[j] = { 'ClusterNumber': j, 'x': , 'y': 1, 'opt': null, 'size': data.AnalysisModels[i].Model.Clusters[j].Solvents.length * 10 };
            }
            
        }
            selectedAlgorithm = data.AnalysisModels[0].Model.AlgorithmName;

            $http({
                method: 'GET',
                url: 'api/Analysis/GetSolvents',
                params: { id: $routeParams.id }
            }).success(function succesCallback(data) {
                solvents = data;
                $scope.solvents = data;
            });

            $scope.models = data.AnalysisModels;
            $scope.analysisName = data.Name;

            $("div.bhoechie-tab-menu>div.list-group>a").click(function (e) {
                e.preventDefault();
                $(this).siblings('a.active').removeClass("active");
                $(this).addClass("active");
                var index = $(this).index();
                $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
                $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
            });

        var chart = new CanvasJS.Chart("chartContainer",
        {
            zoomEnabled: true,
            animationEnabled: true,
            title: {
                text: "Employment In Agriculture VS Agri-Land and Population"

            },
            axisX: {
                title: "Employment - Agriculture",

                valueFormatString: "#0'%'",
                maximum: 100,
                gridThickness: 1,
                tickThickness: 1,
                gridColor: "lightgrey",
                tickColor: "lightgrey",
                lineThickness: 0
            },
            axisY: {
                title: "Agricultural Land(sq.km)",
                gridThickness: 1,
                tickThickness: 1,
                gridColor: "lightgrey",
                tickColor: "lightgrey",
                lineThickness: 0,
                valueFormatString: "#0'mn'"

            },

            data: [
            {
                type: "bubble",
                toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span><br/><strong>Employment</strong> {x}% <br/> <strong>Agri Land</strong> {y} million sq. km<br/> <strong>Population</strong> {z} mn",
                dataPoints: [

                { x: 39.6, y: 5.225, z: 1347, name: "China" },
                { x: 3.3, y: 4.17, z: 21.49, name: "Australia" },
                { x: 1.5, y: 4.043, z: 304.09, name: "US" },
                { x: 17.4, y: 2.647, z: 2.64, name: "Brazil" },
                { x: 8.6, y: 2.154, z: 141.95, name: "Russia" },
                { x: 52.98, y: 1.797, z: 1190.86, name: "India" },
                { x: 4.3, y: 1.735, z: 26.16, name: "Saudi Arabia" },
                { x: 1.21, y: 1.41, z: 39.71, name: "Argentina" },
                { x: 5.7, y: .993, z: 48.79, name: "SA" },
                { x: 13.1, y: 1.02, z: 110.42, name: "Mexico" },
                { x: 2.4, y: .676, z: 33.31, name: "Canada" },
                { x: 2.8, y: .293, z: 64.37, name: "France" },
                { x: 3.8, y: .46, z: 127.70, name: "Japan" },
                { x: 40.3, y: .52, z: 234.95, name: "Indonesia" },
                { x: 42.3, y: .197, z: 68.26, name: "Thailand" },
                { x: 31.6, y: .35, z: 78.12, name: "Egypt" },
                { x: 1.1, y: .176, z: 61.39, name: "U.K" },
                { x: 3.7, y: .144, z: 59.83, name: "Italy" },
                { x: 1.8, y: .169, z: 82.11, name: "Germany" }




                ]
            }
            ]
        });

        chart.render();
            

        $scope.selectedSolvent = function selectedSolvent($item) {
            $("#" + selectedAlgorithm + "-" + $item.originalObject.CasNumber).addClass('selectedSolvent');
            var name = $("#" + selectedAlgorithm + "-" + $item.originalObject.CasNumber).attr('name');
            $("#" + name).collapse();
            console.log(name);
        }

        $scope.changetab = function changetab(event, name) {
            $('ul.tabs-test li').removeClass('current');
            $('.tab-content').removeClass('current');

            $(event.currentTarget).addClass('current');
            $("#" + name).addClass('current');
            selectedAlgorithm = name;
        };
        $scope.tester = function() {
            console.log("hello");
        };
        $scope.changeName = function changeName() {
            $http({
                method: 'POST',
                url: 'api/Analysis/ChangeName',
                params: { name: $scope.newName, analysisId: $routeParams.id }
            }).success(function succesCallback(data) {
            });
        }


    });
app.constant('Constants', {
    AlgorithmName: {
        0: 'CANOPY',
        1: 'COBWEB',
        2: 'EM',
        3: 'KMEANS',
        4: 'SOM',
        5: 'XMEANS'
    },
    FeatureName: {
        0: 'Boiling_Point_Minimum_DegreesC',
        1: 'Melting_Point_Minimum_DegreesC',
        2: 'Flash_Point_Minimum_DegreesC',
        3: 'Vapour_Pressure_25DegreesC_mmHg',
        4: 'Density_25DegreesC_Minimum_kg_L',
        5: 'Viscosity_25DegreesC_Minimum_mPa_s'
    }
});
   