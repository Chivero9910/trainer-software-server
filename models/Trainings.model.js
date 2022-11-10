const { Schema, model, default: mongoose } = require("mongoose");

const trainingSchema = new Schema(
    {
      name: String,
      videoUrl: String,
      instructions: String,
      tags: [String],
      trainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    },
    {
      // this second object adds extra properties: `createdAt` and `updatedAt`    
      timestamps: true
    }
  );
  
  const Training = model("Training", trainingSchema);
  
  module.exports = Training;
  