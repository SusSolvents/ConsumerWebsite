app.controller('AnalysisOverviewController',
    function($scope, $window, $http, $routeParams, Constants, result) {
        var solvents = [];
        var selectedAlgorithm;
        var clusters = [];
        var models = [];
        
        var algorithms = [];
        console.log(result.data);
        var data = result.data;

        for (var i = 0; i < data.AnalysisModels.length; i++) {
            data.AnalysisModels[i].Model.AlgorithmName = Constants.AlgorithmName[data.AnalysisModels[i].Model.AlgorithmName];
            algorithms.push(i, Constants.AlgorithmName[data.AnalysisModels[i].Model.AlgorithmName]);
            for (var j = 0; j < data.AnalysisModels[i].Model.Clusters.length; j++) {
                clusters[j] = { 'x': (50 + 25 * j), 'y': (2), 'z': data.AnalysisModels[i].Model.Clusters[j].Solvents.length * 30, 'name':"cluster" + j };
            }
            
        }
        selectedAlgorithm = data.AnalysisModels[0].Model.AlgorithmName;




        $scope.models = data.AnalysisModels;
        $scope.analysisName = data.Name;
        console.log(clusters);
        
        
        var chart = new CanvasJS.Chart("chartContainer",
        {
            title: {
                text: "Clusters"
            },
            data: [
                {
                    type: "bubble",
                    dataPoints: clusters
                }
            ]
        });


        chart.render();

        $scope.selectedSolvent = function selectedSolvent($item) {
            $("#" + selectedAlgorithm + "-" + $item.originalObject.CasNumber).addClass('selectedSolvent');
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
   