app.controller('AnalysisController', 
    function ($scope, $window, $http) {
        var algorithms = [];
        var models;
        $scope.disabled = true;
        $scope.next = { color: 'grey' };
        $scope.modelDisabled = true;
        $scope.showAnalysis = { color: 'grey' };
        $scope.changeColor = function changeColor($event) {
            if ($event.currentTarget.style.background !== "purple") {
                $event.currentTarget.style.background = "purple";
                algorithms.push($event.currentTarget.id);
                console.log(algorithms);
                if (algorithms.length !== 0) {
                    $scope.disabled = false;
                    $scope.next = { color: 'white' }
                }
            } else {
                $event.currentTarget.style.background = "white";
                var index = algorithms.indexOf($event.currentTarget.id);
                algorithms.splice(index, 1);
                console.log(algorithms);
                if (algorithms.length === 0) {
                    $scope.disabled = true;
                    $scope.next = {color : 'grey'}
                }
            }
            
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
        }
    });