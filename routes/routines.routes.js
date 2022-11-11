const Training = require("../models/Trainings.model");

const router = require("express").Router();
const isAuthenticated = require("../middlewares/auth.middlewares");
const Routine = require("../models/Routines.model");

// POST "/api/routine"
router.post("/:clientId", isAuthenticated, async(req, res, next) => {
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

// GET "/api/routine/client"
router.get("/client", isAuthenticated, async (req, res, next) => {
    const {_jd} = req.payload
    try {
        const routines = await Routine.find({user: _id})
        res.status(200).json(routines)
    } catch (error) {
        next(error)
    }
})

// GET "/api/routine/:clientId"
router.get("/:clientId", isAuthenticated, async (req, res, next) => {
    const {clientId} = req.params
    try {
        const routines = await Routine.find({user: clientId})
        res.status(200).json(routines)
    } catch (error) {
        next(error)
    }
})

//PATCH "/api/routine/:routineId"
router.patch("/:routineId", async(req, res, next) => {
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

// DELETE "/api/routine/:routineId"
router.delete("/:routineId", async(req, res, next) => {
    try {
        await Routine.findByIdAndDelete(req.params.routineId)
        res.status(201).json("¡Rutina borrada!")
    } catch (error) {
        next(error)
    }
})


module.exports = router