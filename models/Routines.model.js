const { Schema, model, default: mongoose } = require("mongoose");

const routineSchema = new Schema(
    {
      name: String,
      description: String,
      trainings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Training"
      }],
      isCompleted: Boolean,
      trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    date: Date
    },
    {
      // this second object adds extra properties: `createdAt` and `updatedAt`    
      timestamps: true
    }
  );
  
  const Routine = model("Routine", routineSchema);
  
  module.exports = Routine;
  