app.controller('AnalysisOverviewController',
    function ($scope, $window, $http, $routeParams, Constants) {
        var solvents = [];
        var selectedAlgorithm;
        $http({
            method: 'GET',
            url: 'api/Analysis/GetAnalysis',
            params: { id: $routeParams.id }
        }).success(function succesCallback(data) {
            for (var i = 0; i < data.AnalysisModels.length; i++) {
                data.AnalysisModels[i].Model.AlgorithmName = Constants.AlgorithmName[data.AnalysisModels[i].Model.AlgorithmName];
            }
            selectedAlgorithm = data.AnalysisModels[0].Model.AlgorithmName;
            $scope.models = data.AnalysisModels;
            $scope.analysisName = data.Name;
        });

        $http({
            method: 'GET',
            url: 'api/Analysis/GetSolvents',
            params: { id: $routeParams.id }
        }).success(function succesCallback(data) {
            solvents = data;
            $scope.solvents = data;
        });

        $scope.selectedSolvent = function selectedSolvent($item) {
                $("#"+ selectedAlgorithm + "-" + $item.originalObject.CasNumber).addClass('selectedSolvent');
        }

        $scope.changetab = function changetab(event, name) {
            $('ul.tabs-test li').removeClass('current');
            $('.tab-content').removeClass('current');

            $(event.currentTarget).addClass('current');
            $("#" + name).addClass('current');
            selectedAlgorithm = name;
        };
        $scope.tester = function () {
            console.log("hello");
        };
        $scope.changeName = function changeName() {
            $http({
                method: 'POST',
                url: 'api/Analysis/ChangeName',
                params: { name : $scope.newName,  analysisId: $routeParams.id }
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
})