const Training = require("../models/Trainings.model");

const router = require("express").Router();
const isAuthenticated = require("../middlewares/auth.middlewares");
const Routine = require("../models/Routines.model");


// POST "/api/exercise/trainings"
router.post("/trainings", isAuthenticated, async(req, res, next) => {
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

// GET "/api/exercise/trainings"
router.get("/trainings", async(req, res, next) => {
    try {
       const trainings = await Training.find()
        res.status(200).json(trainings)
    } catch (error) {
        next(error)
    }
})


// POST "/api/exercise/routine"
router.post("/routine/:clientId", isAuthenticated, async(req, res, next) => {
    const {_id} = req.payload
    const {name, description, trainings} = req.body
    if(name === "" || description === "") {
        res.status(400).json({errorMessage: "¡Rellena todos los campos!"})
    }

    try {
        const newRoutine = {
            name,
            description,
            trainings,
            user: req.params.clientId,
            trainer: _id
        }
        await Routine.create(newRoutine)
        res.status(201).json("¡Rutina creada!")
    } catch (error) {
        next(error)
    }
})

// GET "/api/exercise/routine"
router.get("/routine", async (req, res, next) => {
    try {
        const routines = await Routine.find()
        res.status(200).json(routines)
    } catch (error) {
        next(error)
    }
})

//PATCH "/api/exercise/routine/:routineId"
router.patch("/routine/:routineId", async(req, res, next) => {
    const {name, description, trainings, user} = req.body
    if(name === "" || description === "") {
        res.status(400).json({errorMessage: "¡Rellena todos los campos!"})
    }

    try {
        const routineUpdate = {
            name,
            description,
            trainings,
            user
        }
        await Routine.findByIdAndUpdate(req.params.routineId, routineUpdate)
        res.status(201).json("¡Rutina actualizada!")
    } catch (error) {
        next(error)
    }
})

// DELETE "/api/exercise/routine/:routineId"
router.delete("/routine/:routineId", async(req, res, next) => {
    try {
        await Routine.findByIdAndDelete(req.params.routineId)
        res.status(201).json("¡Rutina borrada!")
    } catch (error) {
        next(error)
    }
})


// PATCH "/api/exercise/:trainingId"
router.patch("/trainings/:trainingId", async(req, res, next) => {
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

// DELETE "/api/exercise/:trainingId"
router.delete("/trainings/:trainingId", async (req, res, next) => {
    try {
        await Training.findByIdAndRemove(req.params.trainingId)
        res.status(201).json("¡Entrenamiento borrado!")
    } catch (error) {
        next(error)
    }
})


module.exports = router