const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TrainingSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: "Training Name is Required"
  },
  difficulty: {
    type: String,
    trim: true,
    default: "easy",
  },
  description: {
    type: String,
    trim: true,
  }
  });

const Training = mongoose.model("Training", TrainingSchema);

module.exports = Training;
