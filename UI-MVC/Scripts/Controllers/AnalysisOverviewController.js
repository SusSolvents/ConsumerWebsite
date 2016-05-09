﻿app.controller('AnalysisOverviewController',
    function ($scope, $window, $http, $routeParams, Constants, result, $timeout) {
        var solvents = [];
        var selectedAlgorithm;
        var currentClusters;
        var prevClusters;
        var clusters;
        var algorithms = [];
        var colors = [
            "#44B3C2",
            "#F1A94E",
            "#F2635F",
            "#E0A025",
            "#32B92D",
            "#F20075",
                        "#0093D1"

        ];
        var totalSolvents = 0;
        $scope.models = result.data.AnalysisModels;
        var data = result.data;
        setEnumNames(data);
        selectedAlgorithm = data.AnalysisModels[0].Model.AlgorithmName;
        

        
        $scope.analysisName = data.Name;
        currentClusters = getClusters(findModelOnName(selectedAlgorithm));
        $scope.clusters = currentClusters;

        for (var i = 0; i < data.AnalysisModels.length; i++) {
                clusters = getClusters(data.AnalysisModels[i].Model);
                
            var clusterPositions = [];
                
            for (var j = 0; j < clusters.length; j++) {
                clusterPositions.push(getClusterPosition(clusters[j]));
                    
            }
            var normalizedValues = getNormalizedValues(clusterPositions);
            data.AnalysisModels[i].Model.NormalizedValues = normalizedValues;
        }
        
        $timeout(function () {
                

                for (var i = 0; i < algorithms.length; i++) {
                    if (i === 0) {
                        $('#' + algorithms[i]).addClass("active");
                        $('#' + algorithms[i] + '_CONTENT').addClass("active");
                    }
                    $('#' + algorithms[i]).removeClass("disabled");
                    $('#' + algorithms[i]).removeClass("blurless");
                }
            
                console.log(algorithms);
                createChart(data.AnalysisModels[0].Model);
            createProgress();
        });
        console.log(data);
        function getClusters(model) {
                clusters = [];
                for (var i = 0; i < model.Clusters.length; i++) {
                    clusters.push(model.Clusters[i]);
                    totalSolvents += clusters[i].Solvents.length;
                }
                return clusters;
            }

           function createProgress() {
               prevClusters = currentClusters; 
            for (var i = 0; i < currentClusters.length; i++) {
               
                jQuery("#circle-"+selectedAlgorithm+"-" + i).radialProgress("init", {
                    'size': 90,
                    'fill': 8,
                    'font-size': 25,
                    'font-family': "Questrial",
                    "color": colors[i]
                }).radialProgress("to", { 'perc': ((currentClusters[i].Solvents.length / data.NumberOfSolvents) * 100) - 0.2, 'time': 1000 });
            }
        };
            
            

            function setEnumNames(model) {
                for (var i = 0; i < model.AnalysisModels.length; i++) {
                    model.AnalysisModels[i].Model.AlgorithmName = Constants.AlgorithmName[model.AnalysisModels[i].Model.AlgorithmName];
                    algorithms.push(model.AnalysisModels[i].Model.AlgorithmName);
                    for (var j = 0; j < model.AnalysisModels[i].Model.Clusters.length; j++) {
                        for (var k = 0; k < model.AnalysisModels[i].Model.Clusters[j].Solvents.length; k++) {
                            solvents.push(model.AnalysisModels[i].Model.Clusters[j].Solvents[k]);
                            for (var l = 0; l < model.AnalysisModels[i].Model.Clusters[j].Solvents[k].Features.length; l++) {
                                model.AnalysisModels[i].Model.Clusters[j].Solvents[k].Features[l].FeatureName = Constants.FeatureName[model.AnalysisModels[i].Model.Clusters[j].Solvents[k].Features[l].FeatureName];
                            model.AnalysisModels[i].Model.Clusters[j].Solvents[k].Features[l].Value = Number(model.AnalysisModels[i].Model.Clusters[j].Solvents[k].Features[l].Value.toFixed(2));
                            }
                        }
                    }
                }

                $scope.solvents = solvents;
            }

            function getClusterPosition(cluster) {
                var som = 0;
                for (var i = 0; i < cluster.VectorData.length; i++) {
                    var vector = cluster.VectorData[i].Value;
                som += Math.pow(vector, 2);
                }
                    return Math.sqrt(som);
            }

            function getNormalizedValues(lengths) {
            if (lengths.length === 1) {
                return [0];
            }
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
                    json.push({ 'x': model.NormalizedValues[i], 'y': percentage, 'z': max, 'name': model.Clusters[i].Number, 'cursor': 'pointer', 'solvents': model.Clusters[i].Solvents.length });
                }
                model.maxPercent = Math.max.apply(Math, percentages);
                return json;
            }    


            $("div.bhoechie-tab-menu>div.list-group>a").click(function (e) {
                console.log(e.currentTarget.id);
                e.preventDefault();
                $(this).siblings('a.active').removeClass("active");
                $(this).addClass("active");
                var index = $(this).index();
                $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
                $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
                resetProgress();
                selectedAlgorithm = e.currentTarget.id;
                currentClusters = getClusters(findModelOnName(selectedAlgorithm));
                $scope.clusters = currentClusters;
                createChart(findModelOnName(e.currentTarget.id));
                createProgress();

            });
            function resetProgress() {
                for (var i = 0; i < prevClusters.length; i++) {
                    jQuery("#circle-" + selectedAlgorithm + "-" + i).empty();
                }
            }
        function createChart(model) {
            CanvasJS.addColorSet("greenShades",colors
                );
            var jsonModel = createJsonModel(model);
            var chart = new CanvasJS.Chart("chartContainer_" + model.AlgorithmName,
            {
                colorSet: "greenShades",
                zoomEnabled: true,
                animationEnabled: true,
                animationDuration: 500,
                title: {
                    text: "Clusters"

                },
                axisX: {
                    title: "Relative cluster position",
                    valueFormatString: " ",
                    tickLength: 0,
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
                    title: "% of total solvents",
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
                        toolTipContent: "<span style='\"'color: {color};'\"'><strong>Cluster {name}</strong></span><br/><strong>#solvents</strong> {solvents} <br/> <strong>Percentage</strong> {y}%<br/> <strong>Max distance</strong> {z}",
                        dataPoints: jsonModel,
                        click: function (e) {
                            var solventen = getSolventsFromCluster(model, e.dataPoint.name);
                            $('#overlay_' + model.AlgorithmName).removeClass("not-visible");
                            $('#overlay_' + model.AlgorithmName).addClass("div-overlay");
                            var distances = [];
                            for (var i = 0; i < solventen.length; i++) {
                                distances.push(solventen[i].DistanceToClusterCenter);
                            }
                            var max = Math.max.apply(Math, distances);
                            for (var i = 0; i < solventen.length; i++) {
                                solventen[i].DistanceToClusterPercentage = (solventen[i].DistanceToClusterCenter / max) * 95;
                    }
                            createClusterChart(model.Clusters[e.dataPoint.name]);
                            $scope.solventsInCluster = solventen;
                            $scope.cluster = e.dataPoint.name;
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

        $scope.selectedSolventFunc = function ($item) {
            $scope.selectedSolvent = $item.originalObject;
            //$("#" + selectedAlgorithm + "-" + $item.originalObject.CasNumber).addClass('selectedSolvent');
            //var name = $("#" + selectedAlgorithm + "-" + $item.originalObject.CasNumber).attr('name');
            //$("#" + name).collapse();
            //console.log(name);
        }

        $scope.changeName = function changeName() {
            $http({
                method: 'POST',
                url: 'api/Analysis/ChangeName',
                params: { name: $scope.newName, analysisId: $routeParams.id }
            }).success(function succesCallback(data) {
            });
        }

        $scope.closeOverlay = function closeOverlay(name) {
            $('#overlay_' + name).addClass("not-visible");
            $('#overlay_' + name).removeClass("div-overlay");
            

        }

        function findModelOnName(name) {
            var model = null;
            for (var i = 0; i < data.AnalysisModels.length; i++) {
                if (data.AnalysisModels[i].Model.AlgorithmName === name) {
                    model = data.AnalysisModels[i].Model;
                }
            }
            
            return model;
        }     


        function createClusterChart(cluster){
        var width = 700, height = 410;

        var color = d3.scale.category20();

        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(function (d) { return d.distance; })
            .size([width, height]);
        
        var div = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

            var svg = d3.select("#clusterChart_" + selectedAlgorithm)
                .html("")
            .attr("width", width)
            .attr("height", height);

        var distances = [];
        for (var i = 0; i < cluster.Solvents.length; i++) {
            distances.push(cluster.Solvents[i].DistanceToClusterCenter);
        }

        var distancesNormalized = getNormalizedValues(distances);
        var jsonNodes = [];
            var jsonLinks = [];
            jsonNodes.push({
                "name": "Cluster center",
                "group": 2,
                "value": 20,
                "distance": 0,
                "casNumber": "None"
            });
            var maxSolvent, minSolvent;
            for (var i = 0; i < cluster.Solvents.length; i++) {
                if (maxSolvent === undefined || cluster.Solvents[i].DistanceToClusterCenter > maxSolvent.DistanceToClusterCenter ) {
                    maxSolvent = cluster.Solvents[i];
                }
                if (minSolvent === undefined || cluster.Solvents[i].DistanceToClusterCenter < minSolvent.DistanceToClusterCenter ) {
                    minSolvent = cluster.Solvents[i];
                }
                var node = { "name": cluster.Solvents[i].Name, "group": 1, "casNumber": cluster.Solvents[i].CasNumber, "distance": cluster.Solvents[i].DistanceToClusterCenter.toFixed(2), "value": 10, "solvent": cluster.Solvents[i] };
                jsonNodes.push(node);
                var link = { "source": i + 1, "target": 0, "distance": (distancesNormalized[i] * 160) + 20 };
                jsonLinks.push(link);
            }
            $scope.maxDistance = maxSolvent.DistanceToClusterCenter.toFixed(2);
            $scope.minDistance = minSolvent.DistanceToClusterCenter.toFixed(2);
            $scope.maxSolvent = maxSolvent;
            $scope.minSolvent = minSolvent;

        var jsonGraph = {
            "nodes": jsonNodes,
            "links": jsonLinks
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
                .style("stroke-width", 1)
            ;

          
            var node = svg.selectAll(".node")
                .data(jsonGraph.nodes)
                .enter().append("circle")
                .attr("class", "node")
                    .attr("r", function (d) { return d.value; })
                    .style("fill", function (d) { return color(d.group); })
                    .on("click", function (d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                        div.html("Name: " + d.name + "</br>Cas number: " + d.casNumber + "</br>Distance: " + d.distance)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                    if (d.solvent !== undefined) {
                        $scope.selectedSolvent = d.solvent;
                        $scope.$apply();
                    }
                })
                    .on("mouseout", function (d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
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
        };
    });


app.constant('Constants', {
    AlgorithmName: {
        0: 'CANOPY',
        1: 'EM',
        2: 'KMEANS',
        3: 'SOM',
        4: 'XMEANS'
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
