const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/auth.middlewares");

// POST "/api/auth/signup"
router.post("/signup/trainer", async (req, res, next) => {
  const {
    email,
    password,
    businessName,
    lastName,
    phoneNumber,
    birthDate,
    genre,
    name
  } = req.body;

  //* Validaciones

  // Están cumplimentaddos todos los datos
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
      isTrainer: true
    };

    await User.create(newUser);
    res.status(201).json("¡Usuario registrado correctamente!");
  } catch (error) {
    next(error);
  }
});

router.post("/signup/client", async (req, res, next) => {
  const {
    email,
    password,
    businessName,
    lastName,
    phoneNumber,
    birthDate,
    gender,
    name,
    trainerId,
  } = req.body;

  //* Validaciones

  // Están cumplimentaddos todos los datos
  if (
    email === "" ||
    password === "" ||
    name === "" ||
    lastName === "" ||
    phoneNumber === "" ||
    birthDate === "" ||
    gender === "" ||
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
      gender,
      trainerId,
      isTrainer: false
    };

    await User.create(newUser);
    res.status(201).json("¡Usuario registrado correctamente!");
  } catch (error) {
    next(error);
  }
});

// POST "api/auth/login"
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  //* VALIDACIONES
  // Campos cumplimentados
  if (email === "" || password === "") {
    res.status(400).json("¡Rellena todos los campos!");
  }

  try {
    // Comprobar si existe en la BD
    const foundUser = await User.findOne({ email: email });
    if (foundUser === null) {
      res
        .status(400)
        .json({ errorMessage: "¡El email o la contraseña no es correcta!" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (isPasswordCorrect === false) {
      res
        .status(400)
        .json({ errorMessage: "¡El email o la contraseña no es correcta!" });
    }

    // Payload
    const payload = {
      _id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
    };

    // Token
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.status(200).json({ authToken: authToken });
  } catch (error) {
    next(error);
  }
});

// GET "api/auth/verify"
router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json({user: req.payload})
})

module.exports = router;
