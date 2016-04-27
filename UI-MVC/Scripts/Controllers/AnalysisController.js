﻿app.controller('AnalysisController', 
    function ($scope, $window, $http) {
        var algorithms = [];
        var models;
        $scope.disabled = true;
        $scope.btnclass = "button-right disabled";
        $scope.modelDisabled = true;
        $scope.showAnalysis = { color: 'grey' };
        $scope.changeColor = function changeColor($event) {
            if (!contains(algorithms, $event.currentTarget.id)) {
                $event.currentTarget.style.background = "purple";
                $event.currentTarget.style.color = "white";
                algorithms.push($event.currentTarget.id);
                console.log(algorithms);
                if (algorithms.length !== 0) {
                    $scope.btnclass = "button-right";
                    $scope.disabled = false;
                    $scope.next = { color: 'white' }
                }
            } else {
                $event.currentTarget.style.background = "#f0f1ec";
                $event.currentTarget.style.color = "#034b81";
                var index = algorithms.indexOf($event.currentTarget.id);
                algorithms.splice(index, 1);
                console.log(algorithms);
                if (algorithms.length === 0) {
                    $scope.disabled = true;
                    $scope.btnclass = "button-right disabled";
                }
            }
            
        }

        function contains(a, obj) {
            var i = a.length;
            while (i--) {
                if (a[i] === obj) {
                    return true;
                }
            }
            return false;
        }

        $scope.startAnalysis = function startAnalysis() {
            $http({
                method: 'POST',
                url: 'api/Analysis/StartAnalysis',
                params: {algorithms : algorithms}

            }).success(function (data) {
                models = data;
                $scope.algorithms = data;
            });
        }
        var selectedModel;
        $scope.selectModel = function selectModel($event) {
            if (selectedModel !== undefined) {
                selectedModel.style.background = "none";
            }
            selectedModel = $event.currentTarget;
            $event.currentTarget.style.background = "purple";
            $scope.modelDisabled = false;
            $scope.showAnalysis = { color: 'white' }
            console.log(selectedModel);
        }

        $scope.showAlgorithms = function showAlgorithms() {
            $http({
                method: 'GET',
                url: 'api/Analysis/GetFullModels',
                params: { algorithms: algorithms, dataSet: selectedModel.id }
            }).success(function (data) {
                console.log(data);
            });
        }

        $scope.previous = function previous() {
            algorithms = [];
            delete $scope.algorithms;
            $scope.next = { color: 'grey' }
        }
    });