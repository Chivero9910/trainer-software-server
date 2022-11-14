const Training = require("../models/Trainings.model");

const router = require("express").Router();
const isAuthenticated = require("../middlewares/auth.middlewares");
const Routine = require("../models/Routines.model");


// POST "/api/trainings"
router.post("/", isAuthenticated, async(req, res, next) => {
    const {name, videoUrl, instructions, tags} = req.body
    if(name === "" || videoUrl === "" || instructions === "" || tags === ""){
        res.status(400).json({errorMessage: "¡Rellena todos los campos!"})
    }

    try {
        const newTraining = {
            name,
            videoUrl,
            instructions,
            tags,
            trainerId: req.payload._id
        }
        await Training.create(newTraining)
        res.status(201).json("¡Entrenamiento registrado!")
    } catch (error) {
        next(error)
    }
})

// GET "/api/trainings"
router.get("/", isAuthenticated, async(req, res, next) => {
    const {_id} = req.payload
    try {
       const trainings = await Training.find({trainerId: _id})
        res.status(200).json(trainings)
    } catch (error) {
        next(error)
    }
})

// GET "/api/details/"
router.get("/:trainingId", async(req, res, next) => {
    try {
       const training = await Training.findById(req.params.trainingId)
        res.status(200).json(training)
    } catch (error) {
        next(error)
    }
})

// PATCH "/api/details/:trainingId"
router.patch("/:trainingId", async(req, res, next) => {
    const {name, videoUrl, instructions, tags} = req.body
    try {
        const trainingUpdate = {
            name,
            videoUrl,
            instructions,
            tags
        }
        await Training.findByIdAndUpdate(req.params.trainingId, trainingUpdate)
        res.status(201).json("¡Entrenamiento actualizado!")
    } catch (error) {
        next(errorMessage)
    }
})

// DELETE "/api/:trainingId"
router.delete("/:trainingId", async (req, res, next) => {
    try {
        await Training.findByIdAndRemove(req.params.trainingId)
        res.status(201).json("¡Entrenamiento borrado!")
    } catch (error) {
        next(error)
    }
})


module.exports = router