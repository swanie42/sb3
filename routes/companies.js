(function() {
  "use strict";

  var express = require("express");
  var router = express.Router();

  var mongoose = require("mongoose");
  var Company = mongoose.model("Company");

  var jwt = require("express-jwt");
  var auth = jwt({
    secret: "SECRET", // TODO again, this should be stored in an ENV variable and kept off the codebase, same as it is in the Company model
    companyProperty: "payload"
  });

  // TODO this is probably an issue sending salts and such over the network?
  router.route("/companies")
    .get(auth, function(request, response, next) {
      Company.find(function(err, companies) {
        if (err) {
          return next(err);
        }

        response.json(companies);
      });
    });
    router.route("/companies")
     .post(function(req, res, next) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        message: "Please fill out all fields"
      });
    }

    var company = new Company();

    company.email = req.body.email;
    company.setPassword(req.body.password);

    company.save(function(err) {
      if (err) {
        return next(err);
      }

      return res.json({
        token: user.generateJWT()
      });
    })
  });
  router.route("/companies/:company")
    .get(auth, function(request, response, next) {
      response.json(request.company);
    });

  router.param("company", function(request, response, next, id) {
    var query = Company.findById(id);

    query.exec(function(err, company) {
      if (err) {
        return next(err);
      }

      if (!company) {
        return next(new Error("can't find company"));
      }

      request.company = company;
      return next();
    });
  });

  module.exports = router;
})();
