(function() {
  "use strict";

  var app = angular.module("street-buff.controllers.companies.auth", [
    "ui.router"
  ]);

  app.config([
    "$stateProvider",
    function($stateProvider) {
      $stateProvider.state("companyLogin", {
          parent: "root",
          url: "/companyLogin",
          views: {
            "container@": {
              templateUrl: "partials/companyLogin",
              controller: "CompanyAuthController"
            }
          },
          onEnter: [
            "$state",
            "authService",
            function($state, authService) {
              if (authService.isLoggedIn()) {
                $state.go("home");
              }
            }
          ]
        })
  }]);

  app.controller("CompanyAuthController", [
    "$scope",
    "$state",
    "authService",
    function($scope, $state, authService) {
      $scope.company = {};

      function companyregister() {
        authService.companySignUp($scope.company).error(function(error) {
          $scope.error = error;
        }).then(function() {
          $state.go("companyLogin");
        });
      }



      $scope.company = company;
    }
  ]);
})();
