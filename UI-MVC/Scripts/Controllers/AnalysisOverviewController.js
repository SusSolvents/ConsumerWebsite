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




            $scope.models = data.AnalysisModels;
            $scope.analysisName = data.Name;
        console.log(chartArray);

        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawSeriesChart);
        function drawSeriesChart() {

            var data = new google.visualization.DataTable();
            data.addColumn('string', 'clusterID');
            data.addColumn('number', 'x-as');
            data.addColumn('number', 'y-as');
            data.addColumn('string', 'cluster');
            data.addColumn('number', 'size');
            data.addRows(chartArray);
            var options = {
                title: 'Correlation between life expectancy, fertility rate ' +
                       'and population of some world countries (2010)',
                vAxis: {gridlines: {count: 2}},
                
                sizeAxis: { maxSize: 60}
            };

            var chart = new google.visualization.BubbleChart(document.getElementById('series_chart_div'));
            chart.draw(data, options);
        }

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
   