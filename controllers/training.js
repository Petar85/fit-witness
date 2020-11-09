const router = require("express").Router()
const db = require("../models");

  router.post("/submit", ({body}, res) => {
    console.log(body);
    db.Training.create(body)
      .then((newTr) => {
        console.log(newTr);
        return db.Fitness.findOneAndUpdate({}, { $push: { training: newTr._id } }, { new: true })
      })
      .then(dbFitness  => {
        res.json(newTr);
      }) 
      .catch(err => {
        res.json(err);
      });
  });
  
  router.get("/training", (req, res) => {
    console.log('message from /exercise route');
    db.Training.find({}).sort({_id: 'desc'})
      .then(dbTraining => {
        res.json(dbTraining);
      })
      .catch(err => {
        res.json(err);
      });
  });

  //get route to find by id
  router.get("/training/:id", (req, res) => {
   //   console.log('crb testing:  findById('+req.params.id+')');
  db.Training.findById(req.params.id)
  .then(result => {
   // console.log('crb testing:  result:'+result);

      if(!result) {
          return res.status(404).send({
              message: "Exercise not found with id " + req.params.id
          });            
      }
      res.send(result);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Exercise not found with id " + req.params.id
          });                
      }
      return res.status(500).send({
          message: "Error retrieving exercise with id " + req.params.id
      });
  });
});

// Update an exercise identified by the noteId in the request
router.put("/training/:id", (req, res) => {
  // Validate Request
  if(!req.body.name) {
      return res.status(400).send({
          message: "exercise name can not be empty"
      });
  }
  // Find note and update it with the request body
  db.Training.findByIdAndUpdate(req.params.id, {
      name: req.body.name || "Untitled training",
      description: req.body.description,
      difficulty: req.body.difficulty
  }, {new: true})
  .then(results => {
      if(!results) {
          return res.status(404).send({
              message: "exercise not found with id " + req.params.id
          });
      }
      console.log('CHRIS SERVER is sending back: '+results);
      res.send(results);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "exercise not found with id " + req.params.id
          });                
      }
      return res.status(500).send({
          message: "Error updating note with id " + req.params.id
      });
  });
});

// Delete a note with the specified noteId in the request
router.delete("/training/:id", (req, res) => {
  let trainingId = req.params.id;
  db.Training.findByIdAndRemove(req.params.id)
  .then(results => {
      if(!results) {
          return res.status(404).send({
              message: "exercise not found with id " + req.params.id
          });
      }
      res.send({message: "exercise deleted successfully!"});
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "exercise not found with id " + req.params.id
          });                
      }
      return res.status(500).send({
          message: "Could not delete note with id " + req.params.id
      });
  });
});


module.exports = router;