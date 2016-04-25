app.controller('AnalysisController', 
    function ($scope, $window, $http) {
        var algorithms = [];
        $scope.changeColor = function changeColor($event) {
            if ($event.currentTarget.style.background !== "purple") {
                $event.currentTarget.style.background = "purple";
                algorithms.push($event.currentTarget.id);
                console.log(algorithms);
            } else {
                $event.currentTarget.style.background = "white";
                var index = algorithms.indexOf($event.currentTarget.id);
                algorithms.splice(index, 1);
                console.log(algorithms);
            }
            
        }
        $scope.startAnalysis = function startAnalysis() {
            $http({
                method: 'POST',
                url: 'api/Analysis/StartAnalysis',
                params: {algorithms : algorithms}

            }).success(function() {
                console.log("succes");
            });
        }
    });