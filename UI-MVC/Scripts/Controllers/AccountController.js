



    var RegistrationController = function($scope, $http) {
        var model = this;

        model.message = "";

        model.user = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            confirmPassword: ""
        };

        var registration = function (model, $http) {
            //$http.post("../api/Account/Register?firstname=" + model.user.firstname + "&lastname=" + model.user.lastname + "&email=" + model.user.email + "&password=" + model.user.password + "&picture=a").then(function (response) { $scope.details = reponse });
            $.ajax({
                type: 'POST',
                url: 'api/Account/Register',
                data: { firstname: model.user.firstname, lastname: model.user.lastname, email: model.user.email, password: model.user.password, picture: ""}
            }).done(function(data) {
                $scope.details = data;
            }).fail(function(data) {
                $scope.details = data;
            })
           
        }

        model.submit = function(isValid) {
            console.log("h");
            if (isValid) {
                registration(model, $http);
                model.message = $scope.details;
            } else {
                model.message = "There are still invalid fields below";
            }
        };

    };


    var compareTo = function() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    };

    app.directive("compareTo", compareTo);
    app.controller("RegistrationController", RegistrationController);
    
