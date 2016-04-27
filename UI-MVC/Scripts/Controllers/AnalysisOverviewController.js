app.controller('AnalysisOverviewController',
    function($scope, $window, $http, $routeParams, Constants) {
        $http({
            method: 'GET',
            url: 'api/Analysis/GetAnalysis',
            params: { id: $routeParams.id }
        }).success(function succesCallback(data) {
            console.log(data);
            for (var i = 0; i < data.AnalysisModels.length; i++) {
                data.AnalysisModels[i].Model.AlgorithmName = Constants.AlgorithmName[data.AnalysisModels[0].Model.AlgorithmName];
            }
            
            $scope.models = data.AnalysisModels;
            console.log(data.AnalysisModels);
        });
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