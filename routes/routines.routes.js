const Training = require("../models/Trainings.model");

const router = require("express").Router();
const isAuthenticated = require("../middlewares/auth.middlewares");
const Routine = require("../models/Routines.model");

// POST "/api/routine"
router.post("/create/:clientId", isAuthenticated, async(req, res, next) => {
    const {_id} = req.payload
    const {name, description, trainings, date} = req.body
    if(name === "" || description === "") {
        res.status(400).json({errorMessage: "¡Rellena todos los campos!"})
    }

    try {
        const newRoutine = {
            name,
            description,
            trainings,
            user: req.params.clientId,
            trainer: _id,
            date
        }
        await Routine.create(newRoutine)
        res.status(201).json("¡Rutina creada!")
    } catch (error) {
        next(error)
    }
})

// GET "/api/routine/client"
router.get("/client", isAuthenticated, async(req, res, next) => {
    const {_id} = req.payload
    try {
        const routines = await Routine.find({user: _id}).populate("trainings")
        res.status(200).json(routines)
    } catch (error) {
        next(error)
    }
})

// GET "/api/routine/:clientId"
router.get("/:clientId", isAuthenticated, async (req, res, next) => {
    const {clientId} = req.params
    try {
        const routines = await Routine.find({user: clientId}).populate("trainings")
       
        res.status(200).json(routines)
    } catch (error) {
        next(error)
    }
})


router.get("/routines/:routineId", async(req, res, next) => {
    const {routineId} = req.params
    try {
        const routine = await Routine.findById(routineId).populate("trainings")
        res.status(200).json(routine)
    } catch (error) {
        next(error)
    }
})

//PATCH "/api/routine/:routineId"
router.patch("/update/:routineId", async(req, res, next) => {
    const {name, description, trainings, date} = req.body
    if(name === "" || description === "") {
        res.status(400).json({errorMessage: "¡Rellena todos los campos!"})
    }

    try {
        const routineUpdate = {
            name,
            description,
            trainings,
            date
        }
        await Routine.findByIdAndUpdate(req.params.routineId, routineUpdate)
        res.status(201).json("¡Rutina actualizada!")
    } catch (error) {
        next(error)
    }
})

// DELETE "/api/routine/:routineId"
router.delete("/delete/:routineId", async(req, res, next) => {
    try {
        await Routine.findByIdAndDelete(req.params.routineId)
        res.status(201).json("¡Rutina borrada!")
    } catch (error) {
        next(error)
    }
})


module.exports = router