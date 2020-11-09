const router = require("express").Router()
const db = require("../models");
const mongoose = require("mongoose");

router.get("/all", (req, res) => {
    db.Fitness.find({}, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.json(data);
      }
    });
  });
  
  router.get("/find/:id", (req, res) => {
    db.Training.findOne(
      {
        _id: mongoose.ObjectId(req.params.id)
      },
      (error, data) => {
        if (error) {
          console.log(error);
          res.send(error);
        } else {
          console.log(data);
          res.send(data);
        }
      }
    );
  });
  
  router.post("/update/:id", (req, res) => {
    db.Fitness.update(
      {
        _id: mongoose.ObjectId(req.params.id)
      },
      {
        $set: {
          title: req.body.title,
          note: req.body.note,
          modified: Date.now()
        }
      },
      (error, data) => {
        if (error) {
          res.send(error);
        } else {
          res.send(data);
        }
      }
    );
  });
  
  router.delete("/delete/:id", (req, res) => {
    db.Fitness.remove(
      {
        _id: mongoose.ObjectID(req.params.id)
      },
      (error, data) => {
        if (error) {
          res.send(error);
        } else {
          res.send(data);
        }
      }
    );
  });
  
  router.delete("/clearall", (req, res) => {
    db.Fitness.remove({}, (error, response) => {
      if (error) {
        res.send(error);
      } else {
        res.send(response);
      }
    });
  });

  
  router.get("/populated", (req, res) => {
    db.Fitness.find({})
      .populate("{me: one}, {")
      .then(dbFitness => {
        res.json(dbFitness);
      })
      .catch(err => {
        res.json(err);
      });
  });

  router.get("/Fitness", (req, res) => {
    db.Fitness.find({})
      .then(dbFitness => {
        res.json(dbFitness);
      })
      .catch(err => {
        res.json(err);
      });
  });
  
module.exports = router;