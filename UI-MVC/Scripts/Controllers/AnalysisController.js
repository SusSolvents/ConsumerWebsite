app.controller('AnalysisController', 
    function ($scope, $window, $http, $location) {
        var algorithms = [];
        var models = [];
        
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
                    angular.element(document.querySelector('#progressBar .progress-bar')).css("width", 25 + "%").attr("aria-valuenow", 0);
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
                    angular.element(document.querySelector('#progressBar .progress-bar')).css("width", 0 + "%").attr("aria-valuenow", 0);
                }
            }
            
        };

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
            angular.element(document.querySelector('#overlay')).css("visibility", "visible");
         
            $http({
                method: 'POST',
                url: 'api/Analysis/StartAnalysis',
                params: {algorithms : algorithms}

            }).success(function (data) {
                angular.element(document.querySelector('#progressBar .progress-bar')).css("width", 50 + "%").attr("aria-valuenow", 50);
                models = data;
                $scope.algorithms = data;
                $scope.btnclass = "button-right disabled";
                setTimeout(function() {
                    angular.element(document.querySelector('#overlay')).css("visibility", "collapse");
                    
                }, 2000);
            });
        }
        var selectedModel;
        $scope.selectModel = function selectModel($event) {
            if (selectedModel !== undefined) {
                $event.currentTarget.style.borderColor = "lightgray";
            }
            selectedModel = $event.currentTarget;
            $event.currentTarget.style.borderWidth = "3px";
            $event.currentTarget.style.borderColor = "rgba(156,39,193, 0.8)";
            $event.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.4)";

            $scope.btnclass = "button-right";
          
            angular.element(document.querySelector('#progressBar .progress-bar')).css("width", 90 + "%").attr("aria-valuenow", 90);
            
        }

        $scope.showAlgorithms = function showAlgorithms() {
            $http({
                method: 'POST',
                url: 'api/Analysis/CreateAnalysis',
                params: { algorithms: algorithms, dataSet: selectedModel.id }
            }).success(function (data) {
                console.log(data);
                $location.path("/analysis/overview/" + data.Id);
            });
        }

        $scope.previous = function previous() {
            algorithms = [];
            delete $scope.algorithms;
            $scope.btnclass = "button-right disabled";
            angular.element(document.querySelector('#progressBar .progress-bar')).css("width", 0 + "%").attr("aria-valuenow", 0);
        }
    });