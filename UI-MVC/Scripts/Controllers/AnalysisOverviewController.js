app.controller('AnalysisOverviewController',
    function ($scope, $window, $http, $routeParams, Constants) {
        var solvents = [];
        var selectedAlgorithm;
        var clusters = [];
        var models = [];
        var clusterNames = [];
        var algorithms = [];
        $http({
            method: 'GET',
            url: 'api/Analysis/GetAnalysis',
            params: { id: $routeParams.id }
        }).success(function succesCallback(data) {
            for (var i = 0; i < data.AnalysisModels.length; i++) {
                data.AnalysisModels[i].Model.AlgorithmName = Constants.AlgorithmName[data.AnalysisModels[i].Model.AlgorithmName];
                algorithms.push(i, Constants.AlgorithmName[data.AnalysisModels[i].Model.AlgorithmName]);
            }
            selectedAlgorithm = data.AnalysisModels[0].Model.AlgorithmName;



            models = data.AnalysisModels;

            $scope.models = data.AnalysisModels;
            $scope.analysisName = data.Name;
            /*for (var j = 0; j < data.AnalysisModels.length; j++) {
                setValuesForChart(data.AnalysisModels[j].Model.AlgorithmName);
                intialchart(data.AnalysisModels[j].Model.AlgorithmName);
            }*/
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
        var values = [];
        $scope.init = function (algorithmName) {
            clusters = [];
            clusterNames = [];
            values = [];
            for (var k = 0; k < models.length; k++) {
                if (models[k].Model.AlgorithmName === algorithmName) {
                    clusters = models[k].Model.Clusters;
                }
            }
            for (var cluster in clusters) {
                clusterNames.push("Cluster_" + cluster);
            }
            for (var i = 0; i < clusters.length; i++) {
                for (var j = 0; j < clusters.length; j++) {
                    var value = [i, j, clusters[i].DistanceToClusters[j].Distance];
                    values.push(value);
                }
            }
            intialchart(algorithmName);
        }

        function intialchart(algorithmName) {
            console.log(algorithmName);
            console.log(values);
            $('#' + algorithmName + 'chart').highcharts({
                "chart": {
                    "type": "heatmap",
                    "marginTop": 10,
                    "marginBottom": 40,
                    "height": 450
                },
                "title": {
                    "text": ""
                },
                "xAxis": {
                    "categories": clusterNames
                },
                "yAxis": {
                    "categories": clusterNames,
                    "title": null
                },
                "colorAxis": {
                    "min": 0,
                    "minColor": "#FFFFFF",
                    "maxColor": "#7EB26D"
                },
                "legend": {
                    "align": "right",
                    "layout": "vertical",
                    "margin": 0,
                    "verticalAlign": "top",
                    "y": 25,
                    "symbolHeight": 320
                },
                "tooltip": {
        
                },
                "plotOptions": {
                    "heatmap": {
                        "borderColor": "#7EB26D",
                        "point": {
                            "events": {
                    
                            }
                        }
                    }
                },
                "series": [
                    {
                        "name": "Sales per employee",
                        "borderWidth": 1,
                        "data": values,
                        "dataLabels": {
                            "enabled": true,
                            "color": "black",
                            "style": {
                                "textShadow": "none",
                                "HcTextStroke": null
                            }
                        }
                    }
                ]
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
