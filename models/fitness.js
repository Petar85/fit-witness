const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FitnessSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Name is required.']
  },
  training: [
    {
      type: Schema.Types.ObjectId,
      ref: "Training"
    }
  ]
});

const Fitness = mongoose.model("Fitness", FitnessSchema);

module.exports = Fitness;
