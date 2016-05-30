angular.module('sussol.controllers')
    .controller('AnalysisOverviewController',
    function ($scope, $window, $http, $routeParams, constants, result, $timeout, organisation, minMax, fileReader, $filter) {
        var solvents = [];
        var selectedAlgorithm;
        var organisationUser = organisation.data;
        
        var prevClassifiedInstances;
        var prevClusters;
        var clusters;
        var minMaxValues = minMax.data;
        var models;
        var currentChart = null;
        var showInstance = false;
        var algorithms = [];
        var totalSolvents = 0;
        var colors = [
            "#44B3C2",
            "#F1A94E",
            "#F2635F",
            "#4CD4B0",
            "#8e44ad",
            "#FC575E",
            "#9F0088",
            "#32B92D",
            "#F20075",
            "#E0A025",
            "#0093D1"

        ];

        $scope.sharedWith = result.data.SharedWith;
        $scope.models = result.data.AnalysisModels;
        var data = result.data;
        setEnumMinMax();
        showClusterAnalysis(result.data.AnalysisModels);

        if (organisationUser === "") {
            organisationUser = null;
        }
        $scope.organisationUser = organisationUser;

        if (data.CreatedBy.Id.toString() === $window.sessionStorage.userId) {
            $scope.isOwner = true;
        }

        function showClusterAnalysis(modelsTemp) {
            getClassifiedInstances();
            
            models = modelsTemp;
            setEnumNames();
            setMinMaxValues();
            
            for (var i = 0; i < models.length; i++) {
                clusters = getClusters(models[i].Model);
                var clusterPositions = [];
                for (var j = 0; j < clusters.length; j++) {
                    clusterPositions.push(getClusterPosition(clusters[j]));
                }
                var normalizedValues = getNormalizedValues(clusterPositions);
                models[i].Model.NormalizedValues = normalizedValues;
            }

            
            if (showInstance) {
                for (var i = 0; i < models.length; i++) {
                    if (models[i].Model.AlgorithmName === selectedAlgorithm) {
                        createChart(models[i].Model);
                        showClassifyResult(models[i].ClassifiedInstance.ClusterNumber);
                        $scope.ClassifiedInstance = models[i].ClassifiedInstance;
                    }
                }
            }
            

        }

        selectedAlgorithm = models[0].Model.AlgorithmName;

        $scope.canEdit = false;

        if (data.CreatedBy.Id.toString() === $window.sessionStorage.userId) {
            $scope.canEdit = true;
        }



        $scope.$watch('form.features.$valid', function (newVal) {
            $scope.valid = newVal;
        });

        $scope.analysisName = data.Name;
        
        $timeout(function () {
            for (var i = 0; i < algorithms.length; i++) {
                if (i === 0) {
                    $('#' + algorithms[i]).addClass("active");
                    $('#' + algorithms[i] + '_CONTENT').addClass("active");
                }
                $('#' + algorithms[i]).removeClass("disabled");
                $('#' + algorithms[i]).removeClass("blurless");
            }


            createChart(models[0].Model);
            createProgress(findAnalysisModelOnName(selectedAlgorithm));
        });

        
        $scope.focusFeatureInput = function(event) {
            event.currentTarget.style.borderColor = "purple";
        }


        function getClassifiedInstances() {
            $http({
                method: 'GET',
                url: 'api/Analysis/ReadClassifiedInstances',
                params: { userId: $window.sessionStorage.userId, analysisId: data.Id }
            }).success(function succesCallback(data) {
                prevClassifiedInstances = data;
                $scope.prevClassifiedInstances = prevClassifiedInstances;
            });

        }


        function getClusters(model) {
            clusters = [];
            for (var i = 0; i < model.Clusters.length; i++) {
                clusters.push(model.Clusters[i]);
                totalSolvents += clusters[i].Solvents.length;
            }
            return clusters;
        }

        function createProgress(analysisModel) {
            var totalSolvents = data.NumberOfSolvents;
            $scope.totalSolvents = totalSolvents;
            prevClusters = analysisModel.Model.Clusters;

            for (var i = 0; i < prevClusters.length; i++) {
                jQuery("#circle-" + selectedAlgorithm + "-" + i).radialProgress("init", {
                    'size': 110,
                    'fill': 14,
                    'font-size': 24,
                    'font-family': "Questrial",
                    "color": colors[i]
                }).radialProgress("to", { 'perc': ((prevClusters[i].Solvents.length / totalSolvents) * 100) - 0.2, 'time': 1000 });
            }
        };


        function setEnumNames() {
            
            for (var i = 0; i < models.length; i++) {
                models[i].Model.AlgorithmName = constants.AlgorithmName[models[i].Model.AlgorithmName];
                algorithms.push(models[i].Model.AlgorithmName);
                if (showInstance) {
                    for (var j = 0; j < models[i].ClassifiedInstance.Features.length; j++) {
                        models[i].ClassifiedInstance.Features[j].FeatureName = constants.FeatureName[models[i].ClassifiedInstance.Features[j].FeatureName];
                        models[i].ClassifiedInstance.Features[j].Value = Number(models[i].ClassifiedInstance.Features[j].Value.toFixed(2));
                    }
                }
                for (var j = 0; j < models[i].Model.Clusters.length; j++) {
                    for (var k = 0; k < models[i].Model.Clusters[j].VectorData.length; k++) {
                        models[i].Model.Clusters[j].VectorData[k].FeatureName = constants.FeatureName[models[i].Model.Clusters[j].VectorData[k].FeatureName];
                    }
                    for (var k = 0; k < models[i].Model.Clusters[j].Solvents.length; k++) {
                        
                        for (var l = 0; l < models[i].Model.Clusters[j].Solvents[k].Features.length; l++) {
                            models[i].Model.Clusters[j].Solvents[k].Features[l].FeatureName = constants.FeatureName[models[i].Model.Clusters[j].Solvents[k].Features[l].FeatureName];
                            models[i].Model.Clusters[j].Solvents[k].Features[l].Value = Number(models[i].Model.Clusters[j].Solvents[k].Features[l].Value.toFixed(2));
                        }
                    }
                }
            }


            solvents = [];
            for (var i = 0; i < models[0].Model.Clusters.length; i++) {
                for (var j = 0; j < models[0].Model.Clusters[i].Solvents.length; j++) {
                    solvents.push(models[0].Model.Clusters[i].Solvents[j]);
                }
            }
            $scope.solvents = solvents;

        }

        function setEnumMinMax() {
            for (var i = 0; i < minMaxValues.length; i++) {
                minMaxValues[i].FeatureName = constants.FeatureName[minMaxValues[i].FeatureName];
            }
        }

        $scope.form = {};
        function setMinMaxValues() {
            for (var i = 0; i < minMaxValues.length; i++) {
                minMaxValues[i].value = "";
                minMaxValues[i].valid = true;
            }
            if ($scope.form !== undefined) {
                $scope.form.features.$setPristine();
            }
            
            
            minMaxValues.name = "";
            minMaxValues.casNumber = "";
            $scope.minMaxValues = minMaxValues;
            
        }

        $scope.newSolvent = function newSolvent() {
            addSolvent(minMaxValues, $http);

        };
        
        function addSolvent(values, $http) {
            $('#load').button('loading');
            
            document.getElementById('closecross').disabled = true;
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
            for (var i = 0; i < models.length; i++) {
                modelPaths.push(models[i].Model.ModelPath);
                modelIds.push(models[i].Id);
            }
            var model = {
                'Name': solventName,
                'CasNumber': casNumber,
                'Values': featureValues,
                'FeatureNames': featureNames,
                'AnalysisModels': models,
                'UserId': $window.sessionStorage.userId
            };
            $http({
                method: 'POST',
                url: 'api/Analysis/ClassifyNewSolvent',
                params: { analysisId: data.Id },
                data: model
            }).success(function succesCallback(data) {
                $('#addSolvent-modal').modal('hide');
                showInstance = true;
                showClusterAnalysis(data);
                $scope.errorMessage = undefined;
                $('#load').button('reset');

                document.getElementById('closecross').disabled = false;
                for (var i = 0; i < document.getElementsByClassName("feature-input").length; i++) {
                    document.getElementsByClassName("feature-input")[i].style.borderColor = "black";
                }
                document.getElementById("newSolventCasNr").style.borderColor = "black";
                document.getElementById("newSolventName").style.borderColor = "black";
                setMinMaxValues();
            }).error(function errorCallback(data) {
                $scope.errorMessage = data.Message;
                $('#load').button('reset');
                document.getElementById('closecross').disabled = false;
                for (var i = 0; i < document.getElementsByClassName("feature-input").length; i++) {
                    document.getElementsByClassName("feature-input")[i].style.borderColor = "black";
                }
                document.getElementById("newSolventCasNr").style.borderColor = "black";
                document.getElementById("newSolventName").style.borderColor = "black";

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
            var totalSolvents = model.Model.NumberOfSolvents;

            for (var i = 0; i < model.Model.Clusters.length; i++) {
                var valuesSolvents = [];
                for (var j = 0; j < model.Model.Clusters[i].Solvents.length; j++) {

                    valuesSolvents.push(model.Model.Clusters[i].Solvents[j].DistanceToClusterCenter);
                }
                var max = Math.max.apply(Math, valuesSolvents);


                var percentage = ((valuesSolvents.length) / totalSolvents) * 100;
                
                percentages.push(percentage);

                json[i] = ({
                    'x': model.Model.NormalizedValues[i], 'y': Number(percentage.toFixed(3)), 'z': Number(max.toFixed(3)), 'name': model.Model.Clusters[i].Number, 'cursor': 'pointer', 'solvents': model.Model.Clusters[i].Solvents.length, 'color': colors[i], 'markerBorderColor': "#F4FE00", //change color here
                    'markerBorderThickness': 0
                });

            }
            model.Model.maxPercent = Math.max.apply(Math, percentages);


            return json;
        }


        $("div.bhoechie-tab-menu>div.list-group>a").click(function (e) {
            e.preventDefault();
            $(this).siblings('a.active').removeClass("active");
            $(this).addClass("active");

            $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
            $("#" + e.currentTarget.id + "_CONTENT").addClass("active");
            $scope.closeOverlay(selectedAlgorithm);

            resetProgress();
            selectedAlgorithm = e.currentTarget.id;
            createProgress(findAnalysisModelOnName(selectedAlgorithm));
            $scope.clusters = getClusters(findModelOnName(selectedAlgorithm));
            createChart(findModelOnName(e.currentTarget.id));
            if (showInstance) {
                var datapoint = getDatapoint(findAnalysisModelOnName(e.currentTarget.id).ClassifiedInstance.ClusterNumber);
                changeInstance(findAnalysisModelOnName(e.currentTarget.id).ClassifiedInstance);
                
                setBorderDatapoint(datapoint);
                currentChart.render();
            }
            $scope.$apply();
        });

        function changeInstance(instance) {
            $scope.ClassifiedInstance = instance;
            $scope.$apply();
        }
        $scope.SetStyle = function (index) {
            
            document.getElementsByClassName("feature-input")[index].style.borderColor = "purple";
            var value = document.getElementsByClassName("feature-input")[index].value;
            if (value < minMaxValues[index].MinValue || value > minMaxValues[index].MaxValue) {
                minMaxValues[index].valid = false;
            } else {
                minMaxValues[index].valid = true;
            }
          
            
        }

        $scope.downloadPdf = function() {
            var docDef = { content: "hello, this is the pdf of susol hehe" };
            pdfMake.createPdf(docDef).open();
        }

        function resetProgress() {
            for (var i = 0; i < prevClusters.length; i++) {
                jQuery("#circle-" + selectedAlgorithm + "-" + i).empty();
            }
        }
        function createChart(model) {
            CanvasJS.addColorSet("greenShades", colors
                );
            var jsonModel = createJsonModel(findAnalysisModelOnName(selectedAlgorithm));

            var chart = new CanvasJS.Chart("chartContainer_" + model.AlgorithmName,
            {
                animationEnabled: true,
                animationDuration: 500,
                theme: "theme3",

                backgroundColor: "rgba(30,30,30,1)",

                axisX: {
                    title: "Relative cluster position",
                    valueFormatString: " ",
                    tickLength: 0,
                    viewportMaximum: 1.1,
                    viewportMinimum: -0.1,
                    interval: 0.05,
                    gridThickness: 1,
                    tickThickness: 1,
                    gridColor: "grey",
                    tickColor: "grey",
                    titleFontColor: "gray",
                    lineThickness: 0
                },
                axisY: {
                    title: "% of total solvents",
                    interval: 10,
                    gridThickness: 1,
                    tickThickness: 1,
                    viewportMaximum: model.maxPercent + 15,
                    gridColor: "grey",
                    tickColor: "grey",
                    lineThickness: 0,
                    valueFormatString: "#0'%'",
                    titleFontColor: "gray"

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
                        },
                        mouseout: function (e) {       
                        var tooltip = document.getElementsByClassName("canvasjs-chart-tooltip");
                        for (var i = 0; i < tooltip.length; i++) {
                            tooltip[i].style.display = "none";    
                        }
                    }
                    }
                ]
            });

            chart.render();

            currentChart = chart;
            
        }

        var canvaz;
        function drawClassifySolvent(datapoint) {
            $scope.closeOverlay(selectedAlgorithm);
            if (canvaz !== undefined) {
                canvaz.timeline.stop();
                canvaz.clear();
            }
            var canvas = document.getElementById("canvas-overlay-" + selectedAlgorithm);
            var chartCanvas = document.getElementById("chart-container-" + selectedAlgorithm);
            var xAxisLength = chartCanvas.offsetWidth - 82 - 24; //beginnen tekenen op 87
            var yAxisLength = chartCanvas.offsetHeight - 46 - 73; //beginnen tekenen van chartCanvas.offsetHeight - 46
            canvas.width = xAxisLength;
            canvas.height = yAxisLength;
            canvaz = oCanvas.create({
                canvas: "#canvas-overlay-" + selectedAlgorithm
            });

            var arc = canvaz.display.polygon({
                x: xAxisLength / 2,
                y: yAxisLength / 2,
                radius: 24,
                sides: 6,
                fill: "#F4FE00"
            });
            canvaz.addChild(arc);

            canvaz.setLoop(function () {
                arc.rotation++;
            });
            canvaz.timeline.start();
            window.addEventListener("resize", function () {
                xAxisLength = chartCanvas.offsetWidth - 87 - 24; //beginnen tekenen op 87
                yAxisLength = chartCanvas.offsetHeight - 46 - 117; //beginnen tekenen van chartCanvas.offsetHeight - 46
                canvas.width = xAxisLength;
                canvas.height = yAxisLength;
                canvaz = oCanvas.create({
                    canvas: "#canvas-overlay-" + selectedAlgorithm
                });
            });

            var datapointX = (((datapoint.x + 0.1) / (1.2)) * 100) * (xAxisLength / 100);
            var maxX = currentChart.options.axisY.viewportMaximum;
            var datapointY = canvas.height - (((datapoint.y / maxX) * 100) * (yAxisLength / 100));

            arc.animate({
                x: datapointX,
                y: datapointY,
                radius: 0
            }, {
                duration: 5000,
                easing: "ease-in-expo",
                callback: function () {
                    currentChart.render();
                    this.fill = "transparent";
                    canvaz.redraw();
                    
                }
            });

        }

        function getDatapoint(clusterNumber) {
            var datapoint = null;
            for (var i = 0; i < currentChart.options.data[0].dataPoints.length; i++) {
                if (currentChart.options.data[0].dataPoints[i].name === clusterNumber) {
                    datapoint = currentChart.options.data[0].dataPoints[i];
                }
            }
            return datapoint;
        }


        function showClassifyResult(clusterNumber) {
            var datapoint = getDatapoint(clusterNumber);
            if (datapoint != null) {
                drawClassifySolvent(datapoint);
                setBorderDatapoint(datapoint);
            }
        }

        function setBorderDatapoint(datapoint) {
            datapoint.markerBorderThickness = 5;
        }

        $scope.shareWithOrganisation = function () {
            $http({
                method: 'POST',
                url: 'api/Analysis/ShareWithOrganisation',
                params: { organisationId: organisationUser.Id, analysisId: data.Id }
            }).success(function succesCallback(data) {
                notie.alert(1, "Cluster Analysis shard with the organisation", 2);
                $('#organisation-model').modal('hide');
                $scope.sharedWith = data.SharedWith;
            });
        }



        function getSolventsFromCluster(model, number) {
            return model.Clusters[number].Solvents;
        }

        $scope.selectedSolventFunc = function ($item) {
            $scope.selectedSolvent = $item.originalObject;
            delete $scope.selectedCluster;
            getClusterFromSolvent($scope.selectedSolvent);
            var element = document.getElementsByClassName('angucomplete-holder');
            element[0].style.width = '50px';
        }
        $scope.focusSearch = function(index) {
            var element = document.getElementsByClassName('angucomplete-holder');
            element[index].style.width = '250px';
        }
        $scope.focusOutSearch = function (index) {
            var element = document.getElementsByClassName('angucomplete-holder');
            element[index].style.width = '50px';
        }
        $scope.selectClassifiedSolvent = function (item, index) {
            var btns = document.getElementsByClassName('classifiedBtn');
            for (var i = 0; i < btns.length; i++) {
                btns[i].className += ' disabled-element';
            }
            $('#closecross-solvents').addClass('disabled-element');
           
            $('#classBtn_' + index).button("loading");
            $http({
                method: 'POST',
                url: 'api/Analysis/SetClassifiedSolvent',
                params: { name: item.Name, analysisId: $routeParams.id, userId: $window.sessionStorage.userId }
            }).success(function succesCallback(data) {
                $scope.closeOverlay(selectedAlgorithm);
                $('#prevClassified-modal').modal('hide');
                showInstance = true;
                showClusterAnalysis(data);
                $('#closecross-solvents').removeClass('disabled-element');
                $('#classBtn_' + index).button("reset");
            });

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
                $scope.errorChangeName = undefined;
                $('#changeName-model').modal('hide');
            }).error(function errorCallback(data) {
                $scope.errorChangeName = data.Message;
            });
        }

        $scope.undoShare = function() {
            $http({
                method: 'POST',
                url: 'api/Analysis/UndoShare',
                params: { id: data.Id }
            }).success(function succesCallback(data) {
                $scope.sharedWith = null;
            });
        }

        $scope.closeOverlay = function closeOverlay(name) {
            delete $scope.selectedNodeObject;
            delete $scope.selectedCluster;
            delete $scope.selectedSolvent;
            $('#overlay_' + name).addClass("not-visible");
            $('#overlay_' + name).removeClass("div-overlay");
        }

        function findModelOnName(name) {
            var model = null;
            for (var i = 0; i < models.length; i++) {
                if (models[i].Model.AlgorithmName === name) {
                    model = models[i].Model;
                }
            }
            return model;
        }

        function findAnalysisModelOnName(name) {
            for (var i = 0; i < models.length; i++) {
                if (models[i].Model.AlgorithmName === name) {
                    return models[i];
                }
            }
            return null;
        }

        function getClusterFromSolvent(solvent) {
            var model = findModelOnName(selectedAlgorithm);
            var cluster = null;
            for (var i = 0; i < model.Clusters.length; i++) {
                for (var j = 0; j < model.Clusters[i].Solvents.length; j++) {
                    if (model.Clusters[i].Solvents[j].CasNumber === solvent.CasNumber) {
                        cluster = model.Clusters[i];
                        $scope.selectedSolvent = cluster.Solvents[j];
                    }
                }
            }
            if (cluster !== null) {
                $('#overlay_' + model.AlgorithmName).removeClass("not-visible");
                $('#overlay_' + model.AlgorithmName).addClass("div-overlay");
                var distances = [];
                for (var i = 0; i < cluster.Solvents.length; i++) {
                    distances.push(cluster.Solvents[i].DistanceToClusterCenter);
                }
                var max = Math.max.apply(Math, distances);
                for (var i = 0; i < cluster.Solvents.length; i++) {
                    cluster.Solvents[i].DistanceToClusterPercentage = (cluster.Solvents[i].DistanceToClusterCenter / max) * 95;
                    
                }
                
                createClusterChart(model.Clusters[cluster.Number]);
                $scope.solventsInCluster = cluster.Solvents;
                $scope.cluster = cluster.Number;
            }
        }

        $scope.triggerUpload = function () {
            $("#csvFile").click();
        };
        $scope.csvFile = [];
        $scope.getFile = function (e, files) {
            var reader = new FileReader();
            reader.onload=function(e) {
                var string = reader.result;
                var csv = string.split("\n");
                if (csv.length < 2) {
                    $scope.errorMessage = "Your csv doesn't contain enough lines";
                    $scope.$apply();
                    return false;
                }
                var headers = csv[0].split("\t");
                if (headers.length !== minMaxValues.length + 6) {
                    $scope.errorMessage = "Your csv doens't contain the right amount of headers or it isn't split on tabs";
                    $scope.$apply();
                    return false;
                }
                var values = csv[1].split("\t");
                if (values.length !== minMaxValues.length + 6) {
                    $scope.errorMessage = "Your csv doens't contain the right amount of values or it isn't split on tabs";
                    $scope.$apply();
                    return false;
                }
                headers[0] = headers[0].substr(1);
                headers[headers.length - 1] = headers[headers.length - 1].substr(0, headers[headers.length-1].length - 2);
                values[0] = values[0].substr(1);
                values[values.length - 1] = values[values.length - 1].substr(0, values[headers.length - 1].length - 2);
                if (checkHeaders(headers)) {
                    checkValues(values, headers);
                }
                console.log(csv);
                console.log(headers);
                $scope.$apply();
                $("#csvFile").val('');
                return true;
            }
            reader.readAsText(files[0]);

        };

        function checkValues(arrValues, arrHeaders) {
            try {
                for (var i = 0; i < minMaxValues.length; i++) {
                    if (minMaxValues[i].MinValue > arrValues[i] || minMaxValues[i].MaxValue < arrValues[i]) {
                        console.log("check");
                        $scope.errorMessage = "One of the values is incorrect: " + arrHeaders[i];
                        $scope.$apply();
                        return false;
                    }
                }
            }catch (e) {
                $scope.errorMessage = "There is incorrent data in the file";
                $scope.$apply();
                return false;
            }

            minMaxValues.name = arrValues[1];
            minMaxValues.casNumber = arrValues[3];
            for (var i = 0; i < minMaxValues.length; i++) {
                minMaxValues[i].value = Number(arrValues[i + 6]);
            }
            console.log(minMaxValues);
            delete $scope.errorMessage;
            return true;
        }

        function checkHeaders(arrHeaders) {
            var metaData = [];
            metaData.push("Input");
            metaData.push("ID_Name_1");
            metaData.push("Label");
            metaData.push("ID_CAS_Nr_1");
            metaData.push("ID_EG_Nr");
            metaData.push("ID_EG_Annex_Nr");
            for (var i = 0; i < 6; i++) {
                if (arrHeaders[i] !== metaData[i]) {
                    console.log(arrHeaders[i]);
                    $scope.errorMessage = "Wrong input in headers metaData: " + arrHeaders[i];
                    $scope.$apply();
                    return false;
                }
            }

            for (var i = 6; i < arrHeaders.length; i++) {
                if (arrHeaders[i] !== constants.FeatureName[i - 6]) {
                    $scope.errorMessage = "Wrong input in headers feature names: " + arrHeaders[i];
                    $scope.$apply();
                    return false;
                }
            }
            
            
            return true;
        }



        function createClusterChart(clusterTemp) {
            var cluster = JSON.parse(JSON.stringify(clusterTemp));
            if (showInstance) {
                var currentModel = findAnalysisModelOnName(selectedAlgorithm);
                if (currentModel.ClassifiedInstance.ClusterNumber === cluster.Number) {
                    cluster.Solvents.push(currentModel.ClassifiedInstance);
                }
            }
            for (var i = 0; i < cluster.DistanceToClusters.length; i++) {
                cluster.DistanceToClusters[i].Distance = Number(cluster.DistanceToClusters[i].Distance.toFixed(2));
            }


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
                "casNumber": "None",
                "cluster": cluster
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
                delete $scope.selectedNodeObject;
                delete $scope.selectedCluster;
                $scope.$apply();
                var selectedNode = null;
                var selectedCluster = null;
                var node = svg.selectAll(".node")
                    .data(jsonGraph.nodes)
                    .enter().append("circle")
                    .attr("class", "node")
                    .attr("r", function (d) { return d.value; })
                    .style("stroke", function (d) {
                        if ($scope.selectedSolvent !== undefined && $scope.selectedSolvent.CasNumber === d.casNumber) {
                            var selectedNodeObject = {
                                Name: d.name,
                                CasNumber: d.casNumber,
                                DistanceToClusterCenter: d.distance
                            };
                            selectedNode = this;
                            $scope.selectedNodeObject = selectedNodeObject;
                            $scope.$apply();
                            return "red";
                        } else {
                            return "white";
                        }
                    })
                    .style("fill", function (d) {
                        if (findAnalysisModelOnName(selectedAlgorithm).ClassifiedInstance !== null && findAnalysisModelOnName(selectedAlgorithm).ClassifiedInstance !== undefined) {
                            switch (d.casNumber) {
                                case
                                    findAnalysisModelOnName(selectedAlgorithm).ClassifiedInstance.CasNumber:
                                    return "#F4FE00";
                                    break;
                                case maxSolvent.CasNumber:
                                    return "#E68364";
                                    break;
                                case minSolvent.CasNumber:
                                    return "#26A65B";
                                    break;

                                default:
                                    return color(d.group);
                            }

                        } else {
                            switch (d.casNumber) {
                                case maxSolvent.CasNumber:
                                    return "#E68364";
                                    break;
                                case minSolvent.CasNumber:
                                    return "#26A65B";
                                    break;
                                default:
                                    return color(d.group);
                            }
                        }
                        
                    })
                    .on("click", function (d) {
                        if (d.casNumber === "None") {
                            $scope.selectedCluster = d.cluster;
                            if (selectedNode !== undefined) {
                                d3.select(selectedNode).style("stroke", "white");
                                d3.select(selectedNode).style("stroke-width", "1.5");
                            }
                           
                            d3.select(this).style("stroke", "red");
                            

                            selectedCluster = this;

                        } else {
                            delete $scope.selectedCluster;
                            if (d.solvent !== undefined) {
                                var selectedNodeObject = {
                                    Name: d.solvent.Name,
                                    CasNumber: d.solvent.CasNumber,
                                    DistanceToClusterCenter: Number(d.solvent.DistanceToClusterCenter.toFixed(3))
                                };

                                $scope.selectedNodeObject = selectedNodeObject;
                                if (selectedNode !== undefined) {
                                    d3.select(selectedNode).style("stroke", "white");
                                    d3.select(selectedNode).style("stroke-width", "1.5");
                                }
                                if (selectedCluster !== null) {
                                    d3.select(selectedCluster).style("stroke", "white");
                                    
                                }
                                selectedCluster = null;
                                d3.select(this).style("stroke", "red");
                                d3.select(this).style("stroke-width", "3");
                                selectedNode = this;
                                $scope.selectedSolvent = d.solvent;
                            }
                            
                        }
                        $scope.$apply();
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

angular.module('sussol.services')
.directive('fileChange', ['$parse', function ($parse) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function ($scope, element, attrs, ngModel) {
            var attrHandler = $parse(attrs['fileChange']);
            var handler = function (e) {
                $scope.$apply(function () {
                    attrHandler($scope, { $event: e, files: e.target.files });
                });
            };
            element[0].addEventListener('change', handler, false);
        }
    }
}]);