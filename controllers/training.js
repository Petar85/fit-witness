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
    console.log('message from /training route');
    db.Training.find({}).sort({_id: 'desc'})
      .then(dbTraining => {
        res.json(dbTraining);
      })
      .catch(err => {
        res.json(err);
      });
  });

  
  router.get("/training/:id", (req, res) => {
   
  db.Training.findById(req.params.id)
  .then(result => {
   

      if(!result) {
          return res.status(404).send({
              message: "Training not found with id " + req.params.id
          });            
      }
      res.send(result);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Training not found with id " + req.params.id
          });                
      }
      return res.status(500).send({
          message: "Error retrieving training with id " + req.params.id
      });
  });
});


router.put("/training/:id", (req, res) => {
  
  if(!req.body.name) {
      return res.status(400).send({
          message: "training name can not be empty"
      });
  }
  
  db.Training.findByIdAndUpdate(req.params.id, {
      name: req.body.name || "Untitled training",
      description: req.body.description,
      difficulty: req.body.difficulty
  }, {new: true})
  .then(results => {
      if(!results) {
          return res.status(404).send({
              message: "training not found with id " + req.params.id
          });
      }
      console.log('server is sending back: '+results);
      res.send(results);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "training not found with id " + req.params.id
          });                
      }
      return res.status(500).send({
          message: "Error updating note with id " + req.params.id
      });
  });
});


router.delete("/training/:id", (req, res) => {
  let trainingId = req.params.id;
  db.Training.findByIdAndRemove(req.params.id)
  .then(results => {
      if(!results) {
          return res.status(404).send({
              message: "training not found with id " + req.params.id
          });
      }
      res.send({message: "training deleted successfully!"});
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "training not found with id " + req.params.id
          });                
      }
      return res.status(500).send({
          message: "Could not delete note with id " + req.params.id
      });
  });
});


module.exports = router;