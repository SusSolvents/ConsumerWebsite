app.controller('AnalysisOverviewController',
    function($scope, $window, $http, $routeParams, Constants, result, $rootScope) {
        var solvents = [];
        var selectedAlgorithm;
        
        var models = [];
        var chartArray = [];
        var algorithms = [];
        var data = result.data;
        
            for (var i = 0; i < data.AnalysisModels.length; i++) {
                data.AnalysisModels[i].Model.AlgorithmName = Constants.AlgorithmName[data.AnalysisModels[i].Model.AlgorithmName];
                algorithms.push(data.AnalysisModels[i].Model.AlgorithmName);
            }
        
            for (var i = 0; i < algorithms.length; i++) {
                if (i === 0) {
                    $('#' + algorithms[i]).addClass("active");
                    $('#' + algorithms[i] + '_CONTENT').addClass("active");
                }
                $('#' + algorithms[i]).removeClass("disabled");
                $('#' + algorithms[i]).removeClass("blurless");
            }
            
            
            for (var i = 0; i < data.AnalysisModels.length; i++) {
                var clusters = getClusters(data.AnalysisModels[i].Model);
                var clusterPositions = [];
                for (var j = 0; j < clusters.length; j++) {
                    clusterPositions.push(getClusterPosition(clusters[j]));
                }
                var normalizedValues = getNormalizedValues(clusterPositions);
                data.AnalysisModels[i].Model.NormalizedValues = normalizedValues;
            }

            function getClusters(model) {
                var clusters = [];
                for (var i = 0; i < model.Clusters.length; i++) {
                    clusters.push(model.Clusters[i]);
                }
                return clusters;
            }

            function getClusterPosition(cluster) {
                var som = 0;
                for (var i = 0; i < cluster.VectorData.length; i++) {
                    var vector = cluster.VectorData[i].Value;
                    som += Math.pow(vector,2);
                }
                    return Math.sqrt(som);
            }

            function getNormalizedValues(lengths) {
                var max = Math.max.apply(Math, lengths);
                var min = Math.min.apply(Math, lengths);
                var normalizedValues = [];
                for (var i = 0; i < lengths.length; i++) {
                    normalizedValues.push((lengths[i] - min) / (max - min));
                }
                return normalizedValues;
            }

            function createJsonModel(model) {
                var json = [];
                var percentages = [];
                for (var i = 0; i < model.Clusters.length; i++) {
                    var valuesSolvents = [];
                    for (var j = 0; j < model.Clusters[i].Solvents.length; j++) {
                        valuesSolvents.push(model.Clusters[i].Solvents[j].DistanceToClusterCenter);
                    }
                    var max = Math.max.apply(Math, valuesSolvents);
                    
                    var percentage = (valuesSolvents.length / model.NumberOfSolvents) * 100;
                    percentages.push(percentage);
                    json.push({ 'x': model.NormalizedValues[i], 'y': percentage, 'z': max, 'name': model.Clusters[i].Number });
                }
                model.maxPercent = Math.max.apply(Math, percentages);
                return json;
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
                console.log(e.currentTarget.id);
                createChart(findModelOnName(e.currentTarget.id));
                
            });

        function createChart(model) {
               
            var jsonModel = createJsonModel(model);
            var chart = new CanvasJS.Chart("chartContainer_" + model.AlgorithmName,
            {
                
                zoomEnabled: true,
                animationEnabled: true,
                title: {
                    text: "Clusters"

                },
                axisX: {
                    title: "Cluster position",

                    viewportMaximum: 1.1,
                    viewportMinimum: -0.1,
                    interval: 0.05,
                    gridThickness: 1,
                    tickThickness: 1,
                    gridColor: "lightgrey",
                    tickColor: "lightgrey",
                    lineThickness: 0
                },
                axisY: {
                    title: "size cluster",
                    interval: 10,
                    gridThickness: 1,
                    tickThickness: 1,
                    viewportMaximum: model.maxPercent + 15,
                    gridColor: "lightgrey",
                    tickColor: "lightgrey",
                    lineThickness: 0,
                    valueFormatString: "#0'%'"

            },

                data: [
                    {
                        type: "bubble",
                        toolTipContent: "<span style='\"'color: {color};'\"'><strong>Cluster {name}</strong></span><br/><strong>Normalized values</strong> {x} <br/> <strong>Percentage</strong> {y}%<br/> <strong>Max distance</strong> {z}",
                        dataPoints: jsonModel,
                        click: function (e) {
                            var solventen = getSolventsFromCluster(model, e.dataPoint.name);
                            
                            $('#overlay_' + model.AlgorithmName).addClass("div-overlay");
                            var distances = [];
                            for (var i = 0; i < solventen.length; i++) {
                                distances.push(solventen[i].DistanceToClusterCenter);
                            }
                            var max = Math.max.apply(Math, distances);
                            for (var i = 0; i < solventen.length; i++) {
                                solventen[i].DistanceToClusterPercentage = (solventen[i].DistanceToClusterCenter / max) * 95;
                            }
                            $scope.solventsInCluster = solventen;
                            $scope.$apply();
                        }
                    }
                ]
            });
            
            chart.render();
        }
            
        function getSolventsFromCluster(model, number) {
            return model.Clusters[number].Solvents;
        }

        $scope.selectedSolvent = function selectedSolvent($item) {
            $("#" + selectedAlgorithm + "-" + $item.originalObject.CasNumber).addClass('selectedSolvent');
            var name = $("#" + selectedAlgorithm + "-" + $item.originalObject.CasNumber).attr('name');
            $("#" + name).collapse();
            console.log(name);
        }


        $scope.changeName = function changeName() {
            $http({
                method: 'POST',
                url: 'api/Analysis/ChangeName',
                params: { name: $scope.newName, analysisId: $routeParams.id }
            }).success(function succesCallback(data) {
            });
        }

        $scope.solventClick = function solventClick($event) {
            console.log($event.currentTarget);
        }

        function findModelOnName(name) {
            var model = null;
            for (var i = 0; i < data.AnalysisModels.length; i++) {
                if (data.AnalysisModels[i].Model.AlgorithmName ===  name) {
                    model = data.AnalysisModels[i].Model;
                }
            }
            
            return model;
        }

        createChart(data.AnalysisModels[0].Model);



        var width = 220, height = 200;

        var color = d3.scale.category20();

        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(30)
            .size([width, height]);

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);
        console.log(svg);
        var jsonGraph = {
            "nodes": [
                { "name": "test", "group": 1 },
                { "name": "test1", "group": 1 },
                { "name": "test1", "group": 1 }
            ],
            "links": [
                { "source": 1, "target": 0, "value": 1 }
            ]
        };

        d3.json(jsonGraph, function (error, graph) { 

            force
                .nodes(jsonGraph.nodes)
                .links(jsonGraph.links)
                .start();

            var link = svg.selectAll(".link")
                .data(jsonGraph.links)
              .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", function (d) { return Math.sqrt(d.value); });

            var node = svg.selectAll(".node")
                .data(jsonGraph.nodes)
              .enter().append("circle")
                .attr("class", "node")
                .attr("r", 5)
                .style("fill", function (d) { return color(d.group); })
                .call(force.drag);

            node.append("title")
                .text(function (d) { return d.name; });

            force.on("tick", function () {
                link.attr("x1", function (d) { return d.source.x; })
                    .attr("y1", function (d) { return d.source.y; })
                    .attr("x2", function (d) { return d.target.x; })
                    .attr("y2", function (d) { return d.target.y; });

                node.attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; });
            });
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
        5: 'Viscosity_25DegreesC_Minimum_mPa_s',
        6: 'Autoignition_Temperature_Minimum_DegreesC',
        7: 'Hansen_Delta_D_MPa1_2',
        8: 'Hansen_Delta_P_MPa1_2',
        9: 'Hansen_Delta_H_MPa1_2',
        10: 'Solubility_Water_g_L',
        11: 'Dielectric_Constant_20DegreesC'
    }
});
   