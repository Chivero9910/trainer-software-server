const isAuthenticated = require("../middlewares/auth.middlewares");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const Metrics = require("../models/Metrics.model");

const router = require("express").Router();

router.get("/", isAuthenticated, async(req, res, next) => {
    const {_id} = req.payload
    try {
        const profileInfo = await User.findById(_id)
        res.status(200).json(profileInfo)
    } catch (error) {
        next(error)
    }
})

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

router.get("/metrics", isAuthenticated, async(req, res, next) => {
    const {_id} = req.payload
    try {
        const metrics = await Metrics.find({user: _id})
        res.status(200).json(metrics)
    } catch (error) {
        next(error)
    }
})

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

router.delete("/metrics/:idMetric", async(req, res, next) => {
    try {
        await Metrics.findByIdAndRemove(req.params.idMetric)
        res.status(200).json("¡Métrica borrada!")
    } catch (error) {
        next(error)
    }
})

router.patch("/", isAuthenticated, async(req, res, next) => {
    const {_id} = req.payload
    const {
        email,
        password,
        businessName,
        lastName,
        phoneNumber,
        birthDate,
        genre,
        name,
        role,
        trainerId,
      } = req.body;
      if (
        email === "" ||
        password === "" ||
        name === "" ||
        lastName === "" ||
        phoneNumber === "" ||
        birthDate === "" ||
        genre === "" ||
        businessName === ""
      ) {
        res.status(400).json({ errorMessage: "¡Rellena todos los campos!" });
        return;
      }
    
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
          businessName,
          name,
          lastName,
          phoneNumber,
          birthDate,
          genre,
          trainerId,
          role,
        };
    
        await User.findByIdAndUpdate(_id, newUser);
        res.status(201).json("¡Usuario actualizado correctamente!");
      } catch (error) {
        next(error);
      }
})

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