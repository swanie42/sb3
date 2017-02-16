(function() {
  "use strict";

  var app = angular.module("street-buff", [
    "street-buff.controllers.main",
    "street-buff.controllers.question",
    "street-buff.controllers.auth",
    "street-buff.controllers.companies.auth",
    "street-buff.controllers.nav",
    "street-buff.services.question",
    "street-buff.services.auth",
    "ui.router"
  ]);

  app.config([
    "$stateProvider",
    "$urlRouterProvider",
    function($stateProvider, $urlRouterProvider) {
      $stateProvider.state("root", {
        abstract: true,
        views: {
          "header": {
            templateUrl: "partials/header",
            controller: "NavController"
          }
        }
      });

      $urlRouterProvider.otherwise("home");
    }
  ]);
})();
