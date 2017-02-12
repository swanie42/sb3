(function() {
  "use strict";

  var express = require("express");
  var router = express.Router();

  var mongoose = require("mongoose");
  var Question = mongoose.model("Question");
  var Answer = mongoose.model("Answer");
  var User = mongoose.model("User");

  var jwt = require("express-jwt");
  var auth = jwt({
    secret: "SECRET", // TODO again, this should be stored in an ENV variable and kept off the codebase, same as it is in the User model
    userProperty: "payload"
  });

  router.route("/questions")
    .get(function(req, res, next) {
      Question.find(function(err, questions) {
        if (err) {
          return next(err);
        }

        // Load the author objects, but only the id and username, for security reasons
        Question.populate(questions, {
          path: "author",
          select: "username"
        }).then(function(questions) {
          res.json(questions);
        });
      });
    })
    .post(auth, function(req, res, next) {
      var question = new Question(req.body);
      question.upvotes = 1;
      question.usersWhoUpvoted.push(req.payload._id);

      question.save(function(err, question) {
        if (err) {
          return next(err);
        }

        Question.populate(question, {
          path: "author",
          select: "username"
        }).then(function(question) {
          res.json(question);
        });
      });
    });

  // TODO error handling on these populate promises
  router.route("/questions/:question")
    .get(function(req, res, next) {
      Question.populate(req.question, {
        path: "answers",
      }).then(function(question) {
        Answer.populate(req.question.answers, {
          path: "author",
          select: "username"
        }).then(function(answers) {
          res.json(question);
        });
      });
    })
    .delete(auth, function(req, res, next) {
      // TODO better, more standard way to do this?
      if (req.question.author != req.payload._id) {
        res.statusCode = 401;
        return res.end("invalid authorization");
      }

      // TODO: I wonder if there is a way to define a cascade strategy
      Answer.remove({ question: req.question }, function(err) {
        if (err) {
          return next(err);
        }

        req.question.remove(function(err) {
          if (err) {
            return next(err);
          }

          // TODO what's the best practice here?
          res.send("success");
        });
      });
    });

  router.route("/questions/:question/upvote")
    .put(auth, function(req, res, next) {
      req.question.upvote(req.payload, function(err, question) {
        if (err) {
          return next(err);
        }

        Question.populate(question, {
          path: "author",
          select: "username"
        }).then(function(question) {
          res.json(question);
        });
      });
    });

  router.route("/questions/:question/downvote")
    .put(auth, function(req, res, next) {
      req.question.downvote(req.payload, function(err, question) {
        if (err) {
          return next(err);
        }

        Question.populate(question, {
          path: "author",
          select: "username"
        }).then(function(question) {
          res.json(question);
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

  module.exports = router;
})();
