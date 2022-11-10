const { Schema, model, default: mongoose } = require("mongoose");

const metricsSchema = new Schema(
  {

      pesoCorporal: Number,
      grasaCorporal: Number,
      cuello: Number,
      hombros: Number,
      pecho: Number,
      bicepsIzq: Number,
      bicepsDer: Number,
      anteBrazoIzq: Number,
      anteBrazoDer: Number,
      cintura: Number,
      cadera: Number,
      musloIzq: Number,
      musloDer: Number,
      gemeloIzq: Number,
      gemeloDer: Number,
      user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Metrics = model("Metrics", metricsSchema);

module.exports = Metrics;
