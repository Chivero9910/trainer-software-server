const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    name: String,
    lastName: String,
    phoneNumber: Number,
    bodyMeasures: {
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
      gemeloDer: Number
    },
    businessName: String,
    birthDate: String,
    genre: String,
    trainerId: String,
    role: String
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
