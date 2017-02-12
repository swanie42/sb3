(function() {
  "use strict";

  var express = require("express");
  var router = express.Router();

  var mongoose = require("mongoose");
  var Question = mongoose.model("Question");
  var Answer = mongoose.model("Answer");

  var jwt = require("express-jwt");
  var auth = jwt({
    secret: "SECRET", // TODO again, this should be stored in an ENV variable and kept off the codebase, same as it is in the User model
    userProperty: "payload"
  });

  router.route("/questions/:question/answers")
    .post(auth, function(req, res, next) {
      var answer = new Answer(req.body);
      answer.question = req.question;
      answer.upvotes = 1;
      answer.usersWhoUpvoted.push(req.payload._id);

      answer.save(function(err, answer) {
        if (err) {
          return next(err);
        }

        req.question.answers.push(answer);
        req.question.save(function(err, question) {
          if (err) {
            return next(err);
          }

          Answer.populate(answer, {
            path: "author",
            select: "username"
          }).then(function(answer) {
            res.json(answer);
          });
        })
      })
    });

  router.route("/questions/:question/answers/:answer")
    .delete(auth, function(req, res, next) {
      // TODO better, more standard way to do this?
      if (req.answer.author != req.payload._id) {
        res.statusCode = 401;
        return res.end("invalid authorization");
      }

      // TODO better way to handle this?
      req.question.answers.splice(req.question.answers.indexOf(req.answer), 1);
      req.question.save(function(err, question) {
        if (err) {
          return next(err);
        }

        req.answer.remove(function(err) {
          if (err) {
            return next(err);
          }

          // TODO what's the best practice here?
          res.send("success");
        });
      });
    });

  router.route("/questions/:question/answers/:answer/upvote")
    .put(auth, function(req, res, next) {
      req.answer.upvote(req.payload, function(err, answer) {
        if (err) {
          return next(err);
        }

        Answer.populate(answer, {
          path: "author",
          select: "username"
        }).then(function(answer) {
          res.json(answer);
        });
      });
    });

  router.route("/questions/:question/answers/:answer/downvote")
    .put(auth, function(req, res, next) {
      req.answer.downvote(req.payload, function(err, answer) {
        if (err) {
          return next(err);
        }

        Answer.populate(answer, {
          path: "author",
          select: "username"
        }).then(function(answer) {
          res.json(answer);
        });
      });
    });

  router.param("question", function(req, res, next, id) {
    var query = Question.findById(id);

    query.exec(function(err, question) {
      if (err) {
        return next(err);
      }

      if (!question) {
        return next(new Error("can't find question"));
      }

      req.question = question;
      return next();
    });
  });

  router.param("answer", function(req, res, next, id) {
    var query = Answer.findById(id);

    query.exec(function(err, answer) {
      if (err) {
        return next(err);
      }

      if (!answer) {
        return next(new Error("can't find answer"));
      }

      req.answer = answer;
      return next();
    });
  });

  module.exports = router;
})();
