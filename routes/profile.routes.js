const isAuthenticated = require("../middlewares/auth.middlewares");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const Metrics = require("../models/Metrics.model");

const router = require("express").Router();


//GET "api/profile"
router.get("/", isAuthenticated, async(req, res, next) => {
    const {_id} = req.payload
    try {
        const profileInfo = await User.findById(_id)
        res.status(200).json(profileInfo)
    } catch (error) {
        next(error)
    }
})

//GET "api/profile/:clientId"
router.get("/details/:clientId", async(req, res, next) => {
  const {clientId} = req.params
  try {
      const profileInfo = await User.findById(clientId).sort({date: 1})
      res.status(200).json(profileInfo)
  } catch (error) {
      next(error)
  }
})

//GET "api/profile/trainers"
router.get("/trainers", async(req, res, next) => {
  try {
      const trainerList = await User.find({isTrainer: true})
      res.status(200).json(trainerList)
  } catch (error) {
      next(error)
  }
})

//POST "api/profile/metrics"
router.post("/metrics", isAuthenticated, async(req, res, next) => {
    const {_id} = req.payload
    const{
            pesoCorporal,
            grasaCorporal,
            cuello,
            hombros,
            pecho,
            bicepsIzq,
            bicepsDer,
            anteBrazoIzq,
            anteBrazoDer,
            cintura,
            cadera,
            musloIzq,
            musloDer,
            gemeloIzq,
            gemeloDer
          } = req.body

          try {
            const newMetrics = {
            pesoCorporal,
            grasaCorporal,
            cuello,
            hombros,
            pecho,
            bicepsIzq,
            bicepsDer,
            anteBrazoIzq,
            anteBrazoDer,
            cintura,
            cadera,
            musloIzq,
            musloDer,
            gemeloIzq,
            gemeloDer,
            user: _id
            }

            await Metrics.create(newMetrics)
            res.status(200).json("¡Métricas añadidas!")
          } catch (error) {
            next(error)
          }
})

//GET "api/profile/metrics"
router.get("/metrics", isAuthenticated, async(req, res, next) => {
    const {_id} = req.payload
    try {
        const metrics = await Metrics.find({user: _id}).sort({updatedAt: -1})
        res.status(200).json(metrics)
    } catch (error) {
        next(error)
    }
})

router.get("/metrics/:idMetric", isAuthenticated, async(req, res, next) => {
  const { idMetric} = req.params
  try {
      const metrics = await Metrics.findById(idMetric).sort({updatedAt: -1})
      res.status(200).json(metrics)
  } catch (error) {
      next(error)
  }
})

router.get("/metrics/details/:userId", async(req, res, next) => {
  const { userId} = req.params
  try {
      const metrics = await Metrics.find({user: userId}).sort({updatedAt: -1})
      res.status(200).json(metrics)
  } catch (error) {
      next(error)
  }
})

//GET "api/profile/trainers-clients"
router.get("/trainers-clients", isAuthenticated, async(req, res, next) => {
  const {_id} = req.payload

  console.log(_id)

  try {
    const clients = await User.find({trainerId: _id}).sort({date: 1})
    res.status(200).json(clients)
  } catch (error) {
    next ( error)
  }
})

//PATCH "api/profile/metrics/:idMetric"
router.patch("/metrics/:idMetric", async(req, res, next) => {
    const{
            pesoCorporal,
            grasaCorporal,
            cuello,
            hombros,
            pecho,
            bicepsIzq,
            bicepsDer,
            anteBrazoIzq,
            anteBrazoDer,
            cintura,
            cadera,
            musloIzq,
            musloDer,
            gemeloIzq,
            gemeloDer
          } = req.body

          try {
            const updateMetrics = {
            pesoCorporal,
            grasaCorporal,
            cuello,
            hombros,
            pecho,
            bicepsIzq,
            bicepsDer,
            anteBrazoIzq,
            anteBrazoDer,
            cintura,
            cadera,
            musloIzq,
            musloDer,
            gemeloIzq,
            gemeloDer
            }

            await Metrics.findByIdAndUpdate(req.params.idMetric, updateMetrics)
            res.status(200).json("¡Métricas actualizadas!")
          } catch (error) {
            next(error)
          }
})

//DELETE "api/profile/metrics/:idMetric"
router.delete("/metrics/:idMetric", async(req, res, next) => {
    try {
        await Metrics.findByIdAndRemove(req.params.idMetric)
        res.status(200).json("¡Métrica borrada!")
    } catch (error) {
        next(error)
    }
})

//PATCH "api/profile"
router.patch("/update", isAuthenticated, async(req, res, next) => {
    const {_id} = req.payload
    const {
        email,
        password,
        lastName,
        phoneNumber,
        birthDate,
        genre,
        name
      } = req.body;
    
      // Mail recibe un formato válido
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ message: "¡El mail introducido no es válido!" });
        return;
      }
    
      // Contraseña válida
      const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      if (!passwordRegex.test(password)) {
        res.status(400).json({
          message:
            "¡La contraseña debe tener al menos 6 carácteres y contener al menos un número, una minúscula y una mayúscula!",
        });
        return;
      }
    
      try {
        const foundEmail = await User.findOne({ email });
        if (foundEmail !== null) {
          res
            .status(400)
            .json({ errorMessage: "El email ya ha sido previamente registrado" });
          return;
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
    
        const newUser = {
          email,
          password: hashPassword,
          name,
          lastName,
          phoneNumber,
          birthDate,
          genre
        };
    
        await User.findByIdAndUpdate(_id, newUser);
        res.status(201).json("¡Usuario actualizado correctamente!");
      } catch (error) {
        next(error);
      }
})

//DELETE "api/profile"
router.delete("/", isAuthenticated, async(req, res, next) => {
    const {_id} = req.payload
    try {
        await User.findByIdAndDelete(_id)
        res.status(201).json("¡Usuario eliminado!")
    } catch (error) {
        next(error)
    }
})



module.exports = router;