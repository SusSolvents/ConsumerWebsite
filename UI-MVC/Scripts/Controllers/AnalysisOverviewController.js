app.controller('AnalysisOverviewController',
    function ($scope, $window, $http, $routeParams, Constants, result, $timeout, organisations, minMax) {
        var solvents = [];
        var selectedAlgorithm;
        var organisationsUser = organisations.data;
        $scope.organisationsUser = organisationsUser;
        console.log(organisationsUser);
        var prevClusters;
        var clusters;
        var minMaxValues = minMax.data;
        var algorithms = [];
        var colors = [
            "#44B3C2",
            "#F1A94E",
            "#F2635F",
            "#32B92D",
            "#F20075",
            "#E0A025",

            "#0093D1"

        ];
        var totalSolvents = 0;
        $scope.models = result.data.AnalysisModels;
        var data = result.data;

        setEnumNames();
        selectedAlgorithm = data.AnalysisModels[0].Model.AlgorithmName;

        $scope.canEdit = false;

        if (data.CreatedBy.Id.toString() === $window.sessionStorage.userId) {
            $scope.canEdit = true;
        }


        $scope.$watch('createBusinessForm.$valid', function (newVal) {
            //$scope.valid = newVal;
            $scope.informationStatus = true;
        });



        $scope.analysisName = data.Name;

        $scope.clusters = getClusters(findModelOnName(selectedAlgorithm));

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


            createChart(data.AnalysisModels[0].Model);

        });

        function getClusters(model) {
            clusters = [];
            for (var i = 0; i < model.Clusters.length; i++) {
                clusters.push(model.Clusters[i]);
                totalSolvents += clusters[i].Solvents.length;
            }
            return clusters;
        }

        function createProgress(jso) {
            prevClusters = jso;
            for (var i = 0; i < jso.length; i++) {
                jQuery("#circle-" + selectedAlgorithm + "-" + i).radialProgress("init", {
                    'size': 90,
                    'fill': 12,
                    'font-size': 25,
                    'font-family': "Questrial",
                    "color": colors[jso[i].name]
                }).radialProgress("to", { 'perc': ((jso[jso[i].name].solvents / data.NumberOfSolvents) * 100) - 0.2, 'time': 1000 });
            }
        };


        function setEnumNames() {
            for (var i = 0; i < data.AnalysisModels.length; i++) {
                data.AnalysisModels[i].Model.AlgorithmName = Constants.AlgorithmName[data.AnalysisModels[i].Model.AlgorithmName];
                algorithms.push(data.AnalysisModels[i].Model.AlgorithmName);
                for (var j = 0; j < data.AnalysisModels[i].Model.Clusters.length; j++) {
                    for (var k = 0; k < data.AnalysisModels[i].Model.Clusters[j].Solvents.length; k++) {
                        solvents.push(data.AnalysisModels[i].Model.Clusters[j].Solvents[k]);
                        for (var l = 0; l < data.AnalysisModels[i].Model.Clusters[j].Solvents[k].Features.length; l++) {
                            data.AnalysisModels[i].Model.Clusters[j].Solvents[k].Features[l].FeatureName = Constants.FeatureName[data.AnalysisModels[i].Model.Clusters[j].Solvents[k].Features[l].FeatureName];
                            data.AnalysisModels[i].Model.Clusters[j].Solvents[k].Features[l].Value = Number(data.AnalysisModels[i].Model.Clusters[j].Solvents[k].Features[l].Value.toFixed(2));
                        }
                    }
                }
            }
           for (var i = 0; i < minMaxValues.length; i++) {
               minMaxValues[i].FeatureName = Constants.FeatureName[minMaxValues[i].FeatureName];
               minMaxValues[i].value = 0;
           }
           minMaxValues.name = "";
            minMaxValues.casNumber = "";
            $scope.minMaxValues = minMaxValues;
            $scope.solvents = solvents;
        }

        $scope.newSolvent = function newSolvent() {
                addSolvent(minMaxValues, $http);

        };

        function addSolvent(values, $http) {
            var solventName = values.name;
            var casNumber = values.casNumber;
            var featureNames = [];
            var featureValues = [];
            var modelPaths = [];
            var modelIds = [];
            for (var i = 0; i < values.length; i++) {
                featureNames.push(values[i].FeatureName);
                featureValues.push(values[i].value);
            }
            for (var i = 0; i < data.AnalysisModels.length; i++) {
                modelPaths.push(data.AnalysisModels[i].Model.ModelPath);
                modelIds.push(data.AnalysisModels[i].Id);
            }
            
            $http({
                method: 'POST',
                url: 'api/Analysis/ClassifyNewSolvent',
                params: {
                    name: solventName,
                    casNumber: casNumber,
                    values: featureValues,
                    featureNames: featureNames,
                    modelPaths: modelPaths,
                    userId: $window.sessionStorage.userId,
                    analysisIds: modelIds
                }
            }).success(function succesCallback(data) {

            });
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

                json[i] = ({ 'x': model.NormalizedValues[i], 'y': percentage, 'z': max, 'name': model.Clusters[i].Number, 'cursor': 'pointer', 'solvents': model.Clusters[i].Solvents.length });

            }
            model.maxPercent = Math.max.apply(Math, percentages);


            return json;
        }


        $("div.bhoechie-tab-menu>div.list-group>a").click(function (e) {

            e.preventDefault();
            $(this).siblings('a.active').removeClass("active");
            $(this).addClass("active");

            $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
            $("#" + e.currentTarget.id + "_CONTENT").addClass("active");
            resetProgress();
            selectedAlgorithm = e.currentTarget.id;

            $scope.clusters = getClusters(findModelOnName(selectedAlgorithm));
            createChart(findModelOnName(e.currentTarget.id));


        });
        function resetProgress() {
            for (var i = 0; i < prevClusters.length; i++) {
                jQuery("#circle-" + selectedAlgorithm + "-" + i).empty();
            }
        }
        function createChart(model) {
            CanvasJS.addColorSet("greenShades", colors
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

                            createClusterChart(model.Clusters[e.dataPoint.name], colors[e.dataPoint.name]);
                            $scope.solventsInCluster = solventen;
                            $scope.cluster = e.dataPoint.name;
                            $scope.$apply();
                        }
                    }
                ]
            });

            chart.render();
            createProgress(jsonModel);
        }

        $scope.shareWithOrganisation = function () {
            console.log($scope.selectedOrganisation);
            if ($scope.selectedOrganisation === undefined) {
                $scope.SharedWithOrganisation = "First select an organisation!";
            } else {
                $http({
                    method: 'POST',
                    url: 'api/Analysis/ShareWithOrganisation',
                    params: { organisationId: $scope.selectedOrganisation.Id, analysisId: data.Id }
                }).success(function succesCallback(data) {
                    notie.alert(1, "Cluster Analysis shard with the organisation", 2);
                    $('#organisation-model').modal('hide');
                });
            }
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
                notie.alert(1, "Name has been changed", 2);
                $scope.analysisName = $scope.newName;
                $scope.newName = "";
                $('#changeName-model').modal('hide');
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


        function createClusterChart(cluster, clustercentercolor) {
            var width = 700, height = 410;

            var color = d3.scale.category20();

            var force = d3.layout.force()
                .charge(-120)
                .linkDistance(function (d) { return d.distance; })
                .size([width, height]);



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
                if (maxSolvent === undefined || cluster.Solvents[i].DistanceToClusterCenter > maxSolvent.DistanceToClusterCenter) {
                    maxSolvent = cluster.Solvents[i];
                }
                if (minSolvent === undefined || cluster.Solvents[i].DistanceToClusterCenter < minSolvent.DistanceToClusterCenter) {
                    minSolvent = cluster.Solvents[i];
                }
                var node = { "name": cluster.Solvents[i].Name, "group": 1, "casNumber": cluster.Solvents[i].CasNumber, "distance": cluster.Solvents[i].DistanceToClusterCenter.toFixed(2), "value": 10, "solvent": cluster.Solvents[i] };
                jsonNodes.push(node);
                var link = { "source": i + 1, "target": 0, "distance": (distancesNormalized[i] * 160) + 33 };
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
                var selectedNode;
                var node = svg.selectAll(".node")
                    .data(jsonGraph.nodes)
                    .enter().append("circle")
                    .attr("class", "node")
                    .attr("r", function (d) { return d.value; })
                    .style("fill", function (d) {

                        if (d.casNumber === maxSolvent.CasNumber) {
                            return "#E68364";
                        } else if (d.casNumber === minSolvent.CasNumber) return "#26A65B";
                        else {
                            return color(d.group);
                        }
                    })
                    .on("click", function (d) {
                        if (d.solvent !== undefined) {
                            $("#selected-node-" + selectedAlgorithm).html("<h4>Selected solvent:</h4>"
                                + d.solvent.Name
                                + "<h4> Cas Number: </h4>" +
                                d.solvent.CasNumber
                                + "<h4> Distance to center: </h4>" +
                                d.solvent.DistanceToClusterCenter.toFixed(3));
                            if (selectedNode !== undefined) {
                                d3.select(selectedNode).style("stroke", "white");
                            }
                            d3.select(this).style("stroke", "red");
                            selectedNode = this;

                            $scope.selectedSolvent = d.solvent;
                            $scope.$apply();

                        }

                    });


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


app.directive('ngMin', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMin, function () {
                if (ctrl.$isDirty) ctrl.$setViewValue(ctrl.$viewValue);
            });

            var isEmpty = function (value) {
                return angular.isUndefined(value) || value === "" || value === null;
            }

            var minValidator = function (value) {
                var min = scope.$eval(attr.ngMin) || 0;
                if (!isEmpty(value) && value < min) {
                    ctrl.$setValidity('ngMin', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngMin', true);
                    return value;
                }
            };

            ctrl.$parsers.push(minValidator);
            ctrl.$formatters.push(minValidator);
        }
    };
});

app.directive('ngMax', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMax, function () {
                if (ctrl.$isDirty) ctrl.$setViewValue(ctrl.$viewValue);
            });
            var maxValidator = function (value) {
                var max = scope.$eval(attr.ngMax) || Infinity;
                if (!isEmpty(value) && value > max) {
                    ctrl.$setValidity('ngMax', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngMax', true);
                    return value;
                }
            };

            ctrl.$parsers.push(maxValidator);
            ctrl.$formatters.push(maxValidator);
        }
    };
});